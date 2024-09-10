const UserModel = require('../models/UserModel')
const getMembers = require('../helpers/getMembers')

const searchUser = async(req,res) => {
    try{
        const { search } = req.body
        console.log('search',search)
        if (search==='') {
            return res.status(200).json({
                message: '검색어를 1글자 이상 입력하셔야합니다.',
                data: [],
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