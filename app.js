const express = require("express");
const app = express();
const io = require("./api/services/SocketIoService")
require("dotenv").config()


const socketIO = new io(app);
socketIO.server.listen(6969, () => console.log("server started"))
