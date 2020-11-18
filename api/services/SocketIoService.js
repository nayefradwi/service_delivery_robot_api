const socketIO = require("socket.io");
const http = require("http");
let socketService;
const fs = require("fs")
const path = require('path');
const filePath = path.join(__dirname,"\\base64.txt")
const fetch = require("node-fetch");
class SocketIoService {
    server;
    io;

    async sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }

    constructor(app) {
        this.server = http.createServer(app);
        this.io = socketIO(this.server)
        this.io.on("connection", socket => {
            console.log("phone connected to socket IO")

            //todo create a socket channel to receive requests/sensor data from the robot
            //todo post the sensor data to the micro service
            socket.on("join", taskId => {
                socket.join(taskId);
            });

            //creates private robot transmission channels
            socket.on("join robot", robotId => {
                socket.join(robotId);
                console.log(robotId);
            })

            socket.on("leave", taskId => {
                socket.leave(taskId);
            });

            //called by the robot
            socket.on("robot moved", async taskId => await this.robotMoved(taskId))
        })
    }

    async robotMoved(taskId) {
        const response = await fetch("https://senior-micro-service.herokuapp.com/robotMovement", {
            method: 'POST',
        });
        const reply = await response.json();
        this.io.in(taskId).emit("image", reply.image);
        console.log("moved robot")
    }

    sendPathAndTaskToRobot(robotId, path,taskId, destinationName) {
        this.io.in(robotId).emit("path", path)
        this.io.in(robotId).emit("taskId",taskId)
        this.io.in(robotId).emit("destinationName",destinationName)
    }

     getBase64TextImage(){
        return fs.readFileSync(filePath,"utf8")
    }
}


function getInstance(app) {
    if (!socketService) {
        if (!app)
            throw "cannot initialize socket service without app instance";
        socketService = new SocketIoService(app)
    }
    return socketService;
}


module.exports = getInstance;