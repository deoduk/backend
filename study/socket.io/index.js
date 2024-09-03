// npm install socket.io

const express = require("express");
const app = express();
const webSocket = require("./socket");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

const server = app.listen(3001, () => {
  console.log("listening on *:3001");
});

webSocket(server);