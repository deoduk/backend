const { JoinModel } = require("../models/ChatModel")
const UserModel = require("../models/UserModel")

async function joinMember(req,res){
    try {
        const {isMember,channelId,userId,userName,profile_pic} = req.body

        if (isMember){ // 맴버면 삭제
            const joinSave = await JoinModel.findOneAndDelete({
                channel: channelId,        
                user: userId,
            })
            return res.status(201).json({
                message: `대화 상대 1명을 삭제했습니다.`,
                data: {userId:userId},
                success: true,
            })
        } else { // 멤버 아니면 추가
            const join = new JoinModel({
                channel: channelId,        
                user: userId,
                userName: userName,
                profile_pic: profile_pic,
            })
            const joinSave = await join.save()
            const user = await UserModel.findById(userId)
            return res.status(201).json({
                message: `대화 상대 1명을 추가했습니다.`,
                data: user,
                success: true,
            })
        }
        
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = joinMember
