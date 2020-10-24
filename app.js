const express = require("express");
const app = express();
const io = require("./api/services/SocketIoService")
const spawn = require('child_process').spawn;


const socketIO = new io(app);
socketIO.server.listen(6969, () => console.log("server started"))
