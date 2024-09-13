const { ChannelModel, JoinModel, MessageModel } = require('../models/ChatModel') 

const getChannels = async(userId) => {
    if (!userId) return []
    // 사용자가 연결된 Join들 구하기
    const joins = await JoinModel.find({user: userId})
        .populate({
            path: 'channel',
            populate: {
                path: 'lastMessage',
                populate: {
                    path: 'writeUser'
                }
            },
            // sort: {updatedAt:-1} 
        })
        .sort({createdAt:-1}) // 조인이 성사된 일자로

    // 위의 조인한 콜렉션으로 정렬순서가 안되서 임시로 사용함        
    // const sorted = joins.sort((a,b)=>{
    //     return new Date(b.channel.updatedAt).getTime() - new Date(a.channel.updatedAt).getTime()
    // })
    // console.log('sorted',sorted)
    const channels = joins.map((join)=>{
        // 내가 안읽은 메세지 갯수 구하기
        const countUnseenMsg = 
            join.lastReadTimestamp < join?.channel?.lastMessage?.createdAt 
            && join?.channel?.lastMessage?.writeUser?._id?.toString() !== userId
            ? 1 : 0

        // 채널 1개씩 반환 축적
        return {
            _id: join?.channel?._id,
            name: join?.channel?.name,
            channel_pic: join?.channel?.channel_pic===''
                ? join?.channel?.lastMessage?.writeUser?.profile_pic
                : join?.channel?.channel_pic,
            unseenMsg: countUnseenMsg, // 않읽은 메세지 갯수
            lastMsgUserName: join?.channel?.lastMessage?.writeUser?.name,
            lastMsgDate: join?.channel?.lastMessage?.createdAt,
            lastMsgText: join?.channel?.lastMessage?.text==='' ? '파일을 보냈습니다.' : join?.channel?.lastMessage?.text // 않읽은 마지막 메세지 1개
        }
    })
    return channels
}

module.exports = getChannels