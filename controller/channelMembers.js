const getMembers = require('../helpers/getMembers')

const channelMembers = async(req,res) => {
    try{
        const { channelId } = req.body
        if (channelId===undefined || channelId==='') {
            return res.status(200).json({
                message: '채널에 속한 멤버가 없습니다.',
                data: [],
                success: true
            })    
        }
        const members = await getMembers(channelId)
        return res.status(200).json({
            message: 'members',
            data: members,
            success: true
        })
    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = channelMembers