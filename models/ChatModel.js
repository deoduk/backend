const mongoose = require('mongoose')

// 채널
const channelSchema = new mongoose.Schema({
    name: {type: String, default: ""}, // 채널명
    channel_pic: {type: String, default: ""}, // 채널사진
    messages:[{ // 여러 대화들 들어감, 배열임
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }],
    lastMessage: {type: mongoose.Schema.ObjectId, ref: 'Message'}, // 마지막메세지 
},{
    timestamps: true
})

// 조인
const joinSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, require: true, ref: 'User'}, // 사용자Id
    channel: {type: mongoose.Schema.ObjectId, require: true, ref: 'Channel'}, // 채널Id
    userName: {type: String, default: ""}, // 조인사용자명
    profile_pic: {type: String, default: ""}, // 조인사진
    lastReadTimestamp: {type: Date} // 마자믹읽은메세지Id
},{
    timestamps: true
})

// 대화내용
const messageSchema = new mongoose.Schema({
    text: {type: String, default: ""},
    imageUrl: {type: String, default: ""},
    videoUrl: {type: String, default: ""},
    writeUser: {type: mongoose.Schema.ObjectId, require: true, ref: 'User'} //작성자id
},{
    timestamps: true
})

const ChannelModel = mongoose.model('Channel',channelSchema)
const JoinModel = mongoose.model('Join',joinSchema)
const MessageModel = mongoose.model('Message',messageSchema)

module.exports = {
    ChannelModel,
    JoinModel,
    MessageModel
}