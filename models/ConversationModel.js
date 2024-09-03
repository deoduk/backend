const mongoose = require('mongoose')

// 대화내용
const messageSchema = new mongoose.Schema({
    text: {type: String, default: ""},
    imageUrl: {type: String, default: ""},
    videoUrl: {type: String, default: ""},
    seen: {type: Boolean, default: false}, //상대방이 읽었냐?여부
    msgByUserId: {type: mongoose.Schema.ObjectId, require: true, ref: 'User'} //작성자id
},{
    timestamps: true
})

// 대화방개념
const conversationSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.ObjectId, require: true, ref: 'User'}, // 최초 대화 발신자
    receiver: {type: mongoose.Schema.ObjectId, require: true, ref: 'User'}, // 최초 대화 수신자
    messages:[{ // 여러 대화들 들어감, 배열임
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }]
},{
    timestamps: true
})

const MessageModel = mongoose.model('Message',messageSchema)
const ConversationModel = mongoose.model('Conversation',conversationSchema)

module.exports = {
    MessageModel,
    ConversationModel
}