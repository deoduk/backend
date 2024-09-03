const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async(token) => {
    if (!token){
        return {
            message: "session out",
            logout: true,
        }
    }
    const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY)
    if (!decode){
        return {
            message: "token expired",
            logout: true,
        }
    }
    const user = await UserModel.findById(decode.id).select('-password')
    return user
    
}

module.exports = getUserDetailsFromToken