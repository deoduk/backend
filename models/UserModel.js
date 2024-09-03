const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{ type: String, required:[true,"이름을 입력하세요."] },
    email:{ type: String, required:[true,"카카오계정을 입력하세요."], unique: true },
    password:{ type: String, required:[true,"비밀번호를 입력하세요."] },
    profile_pic:{ type: String, default:"" }
},{
    timestamp: true
})

const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel
