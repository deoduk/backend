const UserModel = require('../models/UserModel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signIn(req,res){
    try{
        const { email, password } = req.body
        const checkEmail = await UserModel.findOne({email}).select("-password") //select절에서 password제외
        if(!checkEmail){
            return res.status(400).json({
                message: '사용자를 찾을 수 없습니다.',
                error: true
            })
        }
        const userId = checkEmail._id
        const user = await UserModel.findById(userId)
        const verifyPassword = await bcryptjs.compare(password, user.password) //db쪽은 암호화되어있어야함
        
        if(!verifyPassword){
            return res.status(400).json({
                message: '비밀번호가 틀렸습니다.',
                error: true
            })
        }

        // 토큰을 발행해 쿠키에 굽자
        const tokenData = {
            id: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECREAT_KEY,{expiresIn:'1d'})
        const cookieOptions = {
            http: true,
            secure: true
        }
        console.log('checkIn',checkEmail)
        return res.cookie('token',token,cookieOptions).status(200).json({
            message: '환영합니다. 즐거운 시간되세요.',
            token: token,
            data: checkEmail,            
            success: true
        })
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = signIn