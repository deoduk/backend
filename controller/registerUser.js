const UserModel = require("../models/UserModel.js")
const bcryptjs = require('bcryptjs')

async function registerUser(req,res){
    try {
        const {name,email,password,profile_pic} = req.body
        const checkEmail = await UserModel.findOne({email})
        
        if (checkEmail){
            console.log(`이미 존재하는 사용자`)
            return res.status(400).json({
                message: "헉, 있는 사용자거든. 넌 이걸 사용할 수없어. 승질나게 하지마.",
                error: true,
            })
        }
        
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            password: hashpassword,
            profile_pic,
        }
        const user = new UserModel(payload)
        const userSave = await user.save()
    
        console.log(`신규가입성공`)
        return res.status(201).json({
            message: "와우, 신규회원등록이 성공했습니다. 추카추카",
            data: userSave,
            success: true,
        })
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registerUser
