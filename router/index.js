const express = require('express')
const registerUser = require('../controller/registerUser.js')
const signIn = require('../controller/signIn.js')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout.js')
const updateUserDetails = require('../controller/updateUserDetails.js')
const searchUser = require('../controller/searchUser')
const createChannel = require('../controller/createChannel')
const channelMembers = require('../controller/channelMembers')
const joinMember = require('../controller/joinMember')
const gateway = require('../controller/gateway')

const router = express()

router.get("/register",(req,res)=>{
    res.render("RegisterPage",{})
})

router.post("/register",registerUser) //회원가입하기
router.post("/signin",signIn) //로그인

router.get("/user-details",userDetails) //쿠키에 있는 토큰으로 사용자 상세정보 조회
router.get("/logout", logout) //로그아웃

router.post('/update-user', updateUserDetails) //사용자이름+사진을 바꾸게
router.post('/search-user',searchUser) //사용자검색
router.post('/create-channel',createChannel) //채널생성
router.post('/channelMembers',channelMembers) //채널맴버들 반환
router.post('/joinMember',joinMember) //멤버1명 채널에 조인

router.post('/gateway',gateway) //지오젝 App에서 넘어옴

module.exports = router
