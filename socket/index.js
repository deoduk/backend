const express = require('express')
const { Server } = require('socket.io')
const http =  require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ChannelModel, JoinModel, MessageModel } = require('../models/ChatModel')
const getChannels = require('../helpers/getChannels')
const getMessages = require('../helpers/getMessages')

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

    // 최초 접속하면 온라인명단을 보내준다.
    io.emit('onlineUser',Array.from(onlineUser))

    // sidebar : 채팅방 목록달라는 요청
    socket.on('sidebar', async(userId)=>{
        const channels = await getChannels(userId)
        socket.emit('channel-list',channels)
    })

    // 방안에 들어올 때
    socket.on('message-page',async(channelId)=>{
        console.log('query channelId',channelId)

        // 1. 채널세부정보 보내기
        const channelDetails = await ChannelModel.findById(channelId)
        const payload = {
            _id: channelDetails?._id,
            name: channelDetails?.name,
            channel_pic: channelDetails?.channel_pic
        }
        socket.emit('message-channel',payload)
        
        // 2. 대화방에 있는 메세지들 보내기
        const allMessage = await getMessages(channelId)
        socket.emit('messages',allMessage || [])
    })

    // 새 채널 생성
    socket.on('new channel', async(userId,members)=>{
        // const createChannel = await ChannelModel({
        //     name: data?.channelName,
        //     channel_pic: data?.channelProfilePic
        // })
        // channle = await createChannel.save() // DB에 저장
        return
    })
    // 새 멤버 추가
    socket.on('add members', async(channelId,members)=>{
        //구현하세요
    })

    // 새로운 대화
    socket.on('new message', async(data)=>{
        console.log('data',data)
        // 대화1건 생성
        const message = new MessageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            writeUser: data?.writeUser,
        })
        const saveMessage = await message.save() // DB에 저장
        console.log('saveMessage', saveMessage)

        // 4. 대화방과 대화1건 연결
        const updateChannel = await ChannelModel.updateOne({
            _id: data.channelId
        },{
            "$push": {messages: saveMessage?._id}, // 배열에 추가
            lastMessage: saveMessage?._id
        })
        console.log('updatedChannel',updateChannel)

        // 5. 채널에 Join한 사람들에게 보내기
        const joins = await JoinModel.find({channel:data.channelId})
        console.log('joinUsers',joins)

        const allMessage = await getMessages(data.channelId)
        console.log('allMessage',allMessage)
        joins.map(async(join)=>{
            let userId = join?.user?.toString()

            io.to(userId).emit('messages',allMessage || [])
            const channels = await getChannels(userId) // 사람마다 갖고있는 채널들이 다르니까
            console.log('새메세지 channels', channels)
            io.to(userId).emit('channel-list',channels)
        })
    })

    // seen 읽음여부 처리
    socket.on('seen', async(channelId,userId)=>{
        console.log('seen',userId)
        let join = await JoinModel.findOne(
            {user: userId, channel: channelId}
        )
        await JoinModel.updateOne(
            {_id: {"$in": join?._id}}, // 조건식
            {"$set": {lastReadTimestamp: Date()}} // 업데이트절
        )
        // 사이드바에 대화방 목록 업데이트
        const channels = await getChannels(userId)
        console.log('seen return channels', channels)
        io.to(userId).emit('channel-list',channels)
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