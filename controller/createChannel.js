const { ChannelModel, JoinModel } = require("../models/ChatModel")

async function createChannel(req,res){
    try {
        const {userId,channelName} = req.body
        console.log('createChannel1',userId)
        console.log('createChannel2',channelName)

        // 채널 생성
        const channel = new ChannelModel({
            name: channelName
        })
        const channelSave = await channel.save()

        // 조인 만들기
        const join = new JoinModel({
            user: userId, // 사용자Id
            channel: channelSave._id        
        })
        const joinSave = await join.save()
        
        return res.status(201).json({
            message: "채널 생성을 성고했습니다.",
            data: channelSave,
            success: true,
        })
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = createChannel
