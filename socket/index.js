const express = require('express')
const { Server } = require('socket.io')
const http =  require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { MessageModel, ConversationModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app = express()

/***
 * socket connection
 */
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

/***
 * socket running at http://localhost:8080/
 */
const onlineUser = new Set()

io.on('connection',async(socket)=>{
    console.log('connect user ',socket.id)
    const token = socket.handshake.auth.token
    const user = await getUserDetailsFromToken(token)
    if (!user){ //트큰이 없거나, 있어도 유효기간이 지난경우
        socket.destroy()
        return
    }

    //create room
    socket.join(user?._id?.toString()) //socket.id와 user._id를 조인시킴 (toString해야 메세지 실시간 도착) 
    onlineUser.add(user?._id?.toString())

    // 접속하면 제일먼저
    io.emit('onlineUser',Array.from(onlineUser)) //주거니
    socket.on('message-page',async(userId)=>{ //받거니
        console.log('query userId',userId)

        // 1. 대화상대 정보 보내기
        const userDetails = await UserModel.findById(userId).select('-password')
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }
        socket.emit('message-user',payload)
        // 2. 이전 대화목록 보내기
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                {sender: user?._id, receiver: userId}, // 수신함 == 상대방이 먼저보낸것으로 시작한 방이든
                {sender: userId, receiver: user?._id} // 발신함 == 내가 먼저보낸것으로 시작한 방이든
            ]
        }).populate('messages').sort({updatedAt: -1}) // 자동으로 조인해서 메세지 데이타 갖어옴
        console.log('getConversationMessage',getConversationMessage)
        socket.emit('message',getConversationMessage || [])
    })

    // 새로운 대화
    socket.on('new message', async(data)=>{
        console.log('data',data)
        // 1. 기존에 이사람과 나눈대화방이 있는지?
        let conversation = await ConversationModel.findOne({
            "$or" : [
                {sender: data?.sender, receiver: data?.receiver},
                {sender: data?.receiver, receiver: data?.sender}
            ]
        })
        // 2. 첫대화이면 대화방 생성
        if (!conversation){
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save() // DB에 저장
        }
        // 3. 대화1건 생성
        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
        })
        const saveMessage = await message.save() // DB에 저장
        // 4. 대화방과 대화1건 연결
        const updateConversation = await ConversationModel.updateOne({_id: conversation?._id},{
            "$push": {messages: saveMessage?._id} // 배열에 추가
        })
        // 5. sender와 receiver에게 보내기
        // 5-1. 위 1번에 있는 대화방 검색
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                {sender: data?.sender, receiver: data?.receiver},
                {sender: data?.receiver, receiver: data?.sender}
            ]
        }).populate('messages').sort({updatedAt: -1}) // 자동으로 조인해서 메세지 데이타 갖어옴
        io.to(data?.sender).emit('message',getConversationMessage || [])
        io.to(data?.receiver).emit('message',getConversationMessage || [])
        // 6. 사이드바에 대화방 목록 업데이트
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)
        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.receiver).emit('conversation',conversationReceiver)
    })

    // sidebar : 채팅방 목록
    socket.on('sidebar', async(currentUserId)=>{
        const conversation = await getConversation(currentUserId)
        socket.emit('conversation',conversation)
    })

    // seen 읽음여부 처리
    socket.on('seen', async(msgByUserId)=>{
        let conversation = await ConversationModel.findOne({ // 하나의 방을 찾는다.
            "$or": [
                {sender: user?.id, receiver: msgByUserId},
                {sender: msgByUserId, receiver: user?._id}
            ]
        })
        const conversationMessageId = conversation?.messages || [] // 하나의 방안에 있는 전체메세지
        const updateMessages = await MessageModel.updateMany(
            {_id: {"$in": conversationMessageId}, msgByUserId: msgByUserId}, // 조건식
            {"$set": {seen: true}} // 업데이트절
        )
        // 사이드바에 대화방 목록 업데이트
        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)
        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)
    })

    // 연결된 접속 disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log('disconnect user ',socket.id)
    })
})

module.exports = {
    app,
    server
}