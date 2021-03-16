const Task = require("../models/Task");
const socketService = require("../services/SocketIoService");
const io = socketService();
const fetch = require("node-fetch");
const notificationService = require("../services/NotificationService");
const mongoose = require("mongoose");

class TaskRepo {
  async createTask(task, token) {
    const taskCreated = await Task.create({
      room: token._id,
      orderType: task.orderType,
      necessity: task.necessity,
      description: task.description,
    });
    if (!taskCreated) return "failed to create task";
    return await this.getTask(taskCreated._id);
  }

  // deleteTaskNurse
  async deleteTask(id) {
    return Task.deleteOne({ _id: id });
  }

  async deleteTaskNurse(id, hospital) {
    const task = await this.getTaskOfHospital(id, hospital);
    if (!task) return null;
    return Task.deleteOne({ _id: task._id });
  }

  async getTasks(id, skip, limit) {
    return Task.find({ room: id })
      .sort({ lastTimeStatusUpdated: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("room", { password: 0 })
      .populate("necessity");
  }

  async acceptTask(task) {
    try {
      if (task.status === "accepted") return null;
      task.status = "accepted";
      task.lastTimeStatusUpdated = Date.now();
      const taskEdited = await task.save();
      if (!taskEdited) return null;
      const response = await fetch(
        "https://senior-micro-service.herokuapp.com/commands",
        {
          method: "POST",
          body: JSON.stringify({
            x: task.room.gridDestination.x,
            y: task.room.gridDestination.y,
            image: task.room.map.imageUrl,
          }),
        }
      );
      console.log(response);
      const reply = await response.json();
      //todo change 1 to robotId
      io.sendPathAndTaskToRobot(
        1,
        reply.commands,
        task._id,
        "DESTINATION" +
          task.room.map.floorNumber.toString() +
          task.room.roomNumber.toString() +
          task.room.bedNumber.toString()
      );
      notificationService.sendNotifications(
        `Order Accepted!`,
        `Nurse has accepted your order for ${task.necessity.name}`,
        task.room.fcmTokens
      );
      return true;
    } catch (e) {
      console.log(e);
      task.status = "waiting for approval";
      await task.save();
      return null;
    }
  }

  async getTask(id) {
    return Task.findOne({ _id: id })
      .populate("room")
      .populate("necessity")
      .deepPopulate("room.map", "map.password:0");
  }

  async getTasksForNurse(hospitalId) {
    const tasks = await Task.aggregate([
      {
        $lookup: {
          from: "necessities",
          localField: "necessity",
          foreignField: "_id",
          as: "necessity",
        },
      },
      { $unwind: "$necessity" },
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "maps",
          localField: "room.map",
          foreignField: "_id",
          as: "room.map",
        },
      },
      { $unwind: "$room.map" },
      {
        $lookup: {
          from: "hospitals",
          localField: "room.map.hospital",
          foreignField: "_id",
          as: "room.map.hospital",
        },
      },
      { $unwind: "$room.map.hospital" },
      { $match: { "room.map.hospital._id": hospitalId } },
    ]);

    return tasks;
  }

  async getTaskOfHospital(taskId, hospitalId) {
    taskId = mongoose.Types.ObjectId(taskId);
    const tasks = await Task.aggregate([
      {
        $lookup: {
          from: "necessities",
          localField: "necessity",
          foreignField: "_id",
          as: "necessity",
        },
      },
      { $unwind: "$necessity" },
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "maps",
          localField: "room.map",
          foreignField: "_id",
          as: "room.map",
        },
      },
      { $unwind: "$room.map" },
      {
        $lookup: {
          from: "hospitals",
          localField: "room.map.hospital",
          foreignField: "_id",
          as: "room.map.hospital",
        },
      },
      { $unwind: "$room.map.hospital" },
      {
        $match: {
          $and: [{ "room.map.hospital._id": hospitalId }, { _id: taskId }],
        },
      },
    ]);

    return tasks[0];
  }
}

module.exports = new TaskRepo();
