const socketIO = require("socket.io");
const http = require("http");
let socketService;
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "\\base64.txt");
const fetch = require("node-fetch");
const MICROSERVICE_URL_ROBOT_MOVEMENT = "http://127.0.0.1:7000/robotMovement";
const MICROSERVICE_URL_COMMANDS = "http://127.0.0.1:7000/commands";
// const MICROSERVICE_URL_COMMANDS =
// "https://senior-micro-service.herokuapp.com/commands";
// const MICROSERVICE_URL_ROBOT_MOVEMENT =
// "https://senior-micro-service.herokuapp.com/robotMovement";
const mapRepo = require("../repos/MapRepo");
// const taskRepo = require("../repos/TaskRepo");
class SocketIoService {
  server;
  io;

  async sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  constructor(app) {
    this.server = http.createServer(app);
    this.io = socketIO(this.server);

    this.io.on("connection", (socket) => {
      console.log("connected");
      //todo create a socket channel to receive requests/sensor data from the robot
      //todo post the sensor data to the micro service
      socket.on("join", (floorId) => {
        console.log("phone joined on: ");
        console.log(floorId);
        socket.join(floorId);
      });

      socket.on("disconnect", function () {
        console.log("Got disconnected!");
      });

      //creates private robot transmission channels
      socket.on("join robot", (robotId) => {
        socket.join(robotId);
        console.log("robot joined on: ");
        console.log(robotId);
      });

      socket.on("leave", (floorId) => {
        socket.leave(floorId);
      });

      //called by the robot
      socket.on(
        "robot moved",
        async (floorId) => await this.robotMoved(floorId)
      );

      socket.on(
        "obstacle",
        async (obstacleDetailsJson) => await this.getPath(obstacleDetailsJson)
      );
    });
  }
  async getPath(obstacleDetailsJson) {
    console.log("asked for path again");
    console.log(obstacleDetailsJson);
    obstacleDetailsJson = JSON.parse(obstacleDetailsJson);
    const floor = await mapRepo.getMap(obstacleDetailsJson.floorId);
    const body = JSON.stringify({
      currentX: obstacleDetailsJson.currentPosition[1],
      currentY: obstacleDetailsJson.currentPosition[0],
      x: obstacleDetailsJson.endPosition[1],
      y: obstacleDetailsJson.endPosition[0],
      image: floor.imageUrl,
      blockX:
        obstacleDetailsJson.blockPosition == null
          ? undefined
          : obstacleDetailsJson.blockPosition[1],
      blockY:
        obstacleDetailsJson.blockPosition == null
          ? undefined
          : obstacleDetailsJson.blockPosition[0],
    });
    console.log(body);
    if (floor) {
      fetch(MICROSERVICE_URL_COMMANDS, {
        method: "POST",
        body: body,
      }).then(async (response) => {
        const reply = await response.json();
        console.log(reply);

        //todo change 1 to robotId
        this.sendPathAndTaskToRobot(
          1,
          reply.commands,
          floor._id,
          obstacleDetailsJson.destinationName
        );
      });
    }
  }

  async robotMoved(floorId) {
    const response = await fetch(MICROSERVICE_URL_ROBOT_MOVEMENT, {
      method: "POST",
    });
    const reply = await response.json();
    // console.log(reply);
    this.io.to(floorId).emit("image", reply.image);
    // console.log("moved robot");
  }

  sendPathAndTaskToRobot(robotId, path, floorId, destinationName) {
    this.io.in(robotId).emit("path", path);
    this.io.in(robotId).emit("taskId", floorId);
    this.io.in(robotId).emit("destinationName", destinationName);
  }

  confirmOrder(robotId) {
    this.io.in(robotId).emit("robot confirm order", true);
  }

  getBase64TextImage() {
    return fs.readFileSync(filePath, "utf8");
  }
}

function getInstance(app) {
  if (!socketService) {
    if (!app) throw "cannot initialize socket service without app instance";
    socketService = new SocketIoService(app);
  }
  return socketService;
}

module.exports = getInstance;
