const { UnObfuscate } = require("../lib/obfuscate")
const base64 = require('base-64')

const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 60_000;

const gateway = async(req,res) => {
  try {
    const { q } = req.body
    console.log("q1",q)
    console.log("q2",UnObfuscate(q))
    console.log("q3",base64.decode(UnObfuscate(q)))
    const args = base64.decode(UnObfuscate(q)).split(",")
    console.log("args",args)
  
    const timestamp = new Date(args[0].replace(
      /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
      '$4:$5:$6 $2/$3/$1'
    ));
    const diffMin = Math.floor(
      dateDifferenceInMinutes(timestamp,new Date())
    )
    if (diffMin >= 1){ //1분 지났을 경우
      return res.status(200).json({
        message: 'timeout',
        success: false
      })
    }
    if (args[1]==='' || args[1]===undefined){
      return res.status(200).json({
        message: 'user empty',
        success: false
      })
    
    }
    const EmailAddr = args[1]

    // 이메일주소로 사용자를 RestAPI로 찾기
    const URL = `${process.env.ZIOJECT_URL}/api/sync`
    let formData = new FormData()
      formData.append("email", EmailAddr)
      formData.append("action", action)
      formData.append("key1", key1)
      formData.append("key2", key2)
    const response = await axios.post(URL,formData)
    if (response.data.success){
      // 찾은 사용자 + 채팅방+조인
      // 몽고DB에 사용자 존재체크
      // 없다면 몽고DB에 사용자+채팅방+조인 만들기
      // signIn 호출
      // 클라이언트에 /chat/방번호 이동시켜 소켓연결호출하도록
    }else{
      // 지오젝에 사용자 없다면, 그냥 로그인 페이지로 이동시키기
    }
        
    return res.status(200).json({
      message: 'dfdfdf',
      data: "dfdffd",
      success: true
    })
  } catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true
    })
  }
}

module.exports = gateway