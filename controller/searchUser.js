const UserModel = require('../models/UserModel')
const getMembers = require('../helpers/getMembers')

const searchUser = async(req,res) => {
    try{
        const { search, channelId } = req.body
        console.log('search',search)
        console.log('channelId',channelId)
        if (search==='' && channelId===undefined) {
            console.log(111)
            return res.status(200).json({
                message: 'alluser',
                data: [],
                success: true
            })    
        }
        if (search==='' && channelId!==undefined) {
            console.log(2222)
            const members = await getMembers(channelId)
            console.log('members',members)
            return res.status(200).json({
                message: 'members',
                data: members,
                success: true
            })
        }
        const query = new RegExp(search,"i","g")
        const user = await UserModel.find({
            "$or" : [
                {name: query},
                {email: query}
            ]
        }).select('-password')

        return res.status(200).json({
            message: 'alluser',
            data: user,
            success: true
        })
    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = searchUser