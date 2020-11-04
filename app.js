const express = require("express");
const cp = require('cookie-parser');
const parser = require("body-parser");
const app = express();
const io = require("./api/services/SocketIoService");
const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL =  process.env.DB_URL||"mongodb://localhost/senior"
const indexRouter = require("./api/routes/index");
const hospitalRouter = require("./api/routes/hospital");
const nurseRouter = require("./api/routes/nurse");
app.use(parser.json());
app.use(cp());

const {createAdmin} = require("./api/seed")

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// createAdmin();
app.use(indexRouter);
app.use("/hospitals",hospitalRouter);
app.use("/nurses",nurseRouter);

const socketIO = new io(app);
socketIO.server.listen(6969, () => console.log("server started"))
