// socket.js

const SocketIO = require("socket.io");

module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" });
  
  io.on("connection", (socket) => { // 소켓 연결이 되었을 때
    socket.on("chat message", (msg) => { // 이벤트이름으로 전달된 메세지 수신
      io.emit("chat message", msg); //들어온 메세지를 송신
    });
  });
};
