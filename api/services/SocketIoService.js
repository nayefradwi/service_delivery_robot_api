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

            socket.on("join", async taskId => {
                socket.join(taskId);
                console.log(taskId);
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