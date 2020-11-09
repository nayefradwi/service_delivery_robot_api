const socketIO = require("socket.io");
const http = require("http");

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
            socket.on("join", async taskId => {
                socket.join(taskId);
                console.log(taskId);
                // todo before passing the image call the microservice to generate a new one
                for (let i = 0; i<100; i++)
                {
                    this.io.in(taskId).emit("image", i.toString())
                    await this.sleep(1000);
                }
            });

            socket.on("leave", taskId => {
                socket.leave(taskId);
            })
        })
    }

}

module.exports = SocketIoService;