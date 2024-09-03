const { ConversationModel } = require('../models/ConversationModel') 

const getConversation = async(currentUserId) => {
    if (!currentUserId) return []
    const currentUserConversation = await ConversationModel.find({
        "$or": [
            {sender: currentUserId},
            {receiver: currentUserId}
        ]
    }).sort({updatedAt:-1}).populate('messages').populate('sender').populate('receiver')

    const conversation = currentUserConversation.map((conv)=>{
        // 내가 안읽은 메세지 갯수 구하기
        const countUnseenMsg = conv?.messages?.reduce((preve,curr)=>{
            const msgByUserId = curr?.msgByUserId?.toString()
            if (msgByUserId !== currentUserId){ // 내가 작성한게 아니면==받은메세지
                return preve + (curr?.seen ? 0 : 1)
            }else{
                return preve
            }
        },0)

        // 대화방 1개씩 반환 축적
        return {
            _id: conv?._id,
            sender: conv?.sender,
            receiver: conv?.receiver,
            unseenMsg: countUnseenMsg, // 않읽은 메세제 갯수
            lastMsg: conv.messages[conv?.messages?.length-1] // 않읽은 마지막 메세지 1개
        }
    })
    // console.log('conversation',conversation)
    return conversation
}

module.exports = getConversation