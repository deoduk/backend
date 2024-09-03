// socket.js

const SocketIO = require("socket.io");

module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" });

  // 네임스페이스 이벤트 room과 chat 이라는 io 객체를 만든다.
  const room = io.of('/room');
  const chat = io.of('/chat');
  
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제')
    })
  })

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    socket.join(방번호); //방번호는 예시를 위한 임의의 값
    socket.to(방번호).emit('join',{
      user: 'system',
      chat: `${아이디}님이 입장하셨습니다.`,
    });
    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제')
      socket.leave(방번호);
    })
  })
  
};
