const { ChannelModel, MessageModel } = require('../models/ChatModel') 

const getMessages = async(channelId) => {
    if (!channelId) return []

    const messages = await ChannelModel.findById(channelId)
        .populate({
            path: 'messages',
            populate: {
                path: 'writeUser',
            },
        })
        .sort({updatedAt: -1})

    return messages
}

module.exports = getMessages