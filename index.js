const express = require('express')
const cors = require('cors')
const router = require('./router/index.js')
require('dotenv').config({ path: '.env' })
const connectDB = require('./config/connectDB.js')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index.js')

// const app = express()

// middleware
app.use(cors({ //cors설정은 미들웨어 맨위에 존재해야 함
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookiesParser())
app.use('/api',router)
app.set("view engine", "ejs") //화면 엔진을 ejs로 설정한다. (기본폴더는 /views이다)

app.get("/", (req,res)=>{
    res.send("<h1>나의 웹서버에 오신것을 환영합니다.</h1>")
})

connectDB().then(()=>{
    console.log(`와우 내가만든 몽공DB랑 연결 성공했어요.`)   
    server.listen(8080, ()=> {
        console.log(`socket/http/express가 실행되었습니다. http://localhost:8080`)
    })    
})


