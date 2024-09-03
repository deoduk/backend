const express = require('express')
const registerUser = require('../controller/registerUser.js')
const checkSignIn = require('../controller/checkSignIn.js')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout.js')
const updateUserDetails = require('../controller/updateUserDetails.js')
const searchUser = require('../controller/searchUser')

const router = express()

router.get("/register",(req,res)=>{
    res.render("RegisterPage",{})
})

router.post("/register",registerUser) //회원가입하기
router.post("/signin",checkSignIn) //로그인

router.get("/user-details",userDetails) //쿠키에 있는 토큰으로 사용자 상세정보 조회
router.get("/logout", logout) //로그아웃

router.post('/update-user', updateUserDetails) //사용자이름+사진을 바꾸게
router.post('/search-user',searchUser) //사용자검색

module.exports = router