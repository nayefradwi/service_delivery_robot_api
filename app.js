const express = require("express");
const app = express();
const io = require("./api/services/SocketIoService");
const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL =  process.env.DB_URL||"mongodb://localhost/senior"

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});


const socketIO = new io(app);
socketIO.server.listen(6969, () => console.log("server started"))
