const { JoinModel } = require('../models/ChatModel') 

const getMembers = async(channelId) => {
    if (!channelId) return []

    const joins = await JoinModel.find({channel: channelId})
        .populate({
            path: 'user',
        })
        .sort({updatedAt: -1})


    const members = joins.map((join)=>{
        return {
            _id: join?.user?._id,
            email: join?.user?.email,
            name: join?.user?.name,
            profile_pic: join?.user?.profile_pic,
        }
    })
    
    return members
}

module.exports = getMembers