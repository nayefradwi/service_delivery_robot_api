const Task = require("../models/Task");
const socketService = require("../services/SocketIoService");
const io = socketService()
const fetch = require("node-fetch");

class TaskRepo {
    async createTask(task, token) {
        const taskCreated = await Task.create({
            room: token._id,
            orderType: task.orderType,
            necessity: task.necessity,
            description: task.description,
        });
        if (!taskCreated)
            return "failed to create task";
        return await this.getTask(taskCreated._id)
    }

    async deleteTask(id) {
        //todo initiate emergency stop for the robot
        return Task.deleteOne({_id: id});
    }

    async getTasks(id, skip, limit) {
        return Task.find({room: id}).sort({lastTimeStatusUpdated: -1}).skip(parseInt(skip)).limit(parseInt(limit)).populate("room", {password: 0}).populate("necessity");
    }

    async acceptTask(task) {
        try {
            if (task.status === "accepted")
                return null;
            task.status = "accepted";
            const taskEdited = await task.save();
            if (!taskEdited)
                return null;
            const response = await fetch("http://127.0.0.1:8000/commands", {
                method: 'POST',
                body: JSON.stringify({
                    x: task.room.gridDestination.x,
                    y: task.room.gridDestination.y,
                    image: task.room.map.imageUrl,
                }),
            });
            const reply = await response.json();
            //todo change 1 to robotId
            io.sendPathAndTaskToRobot(1, reply.commands, task._id, "DESTINATION" + task.room.map.floorNumber.toString() +
                task.room.roomNumber.toString() + task.room.bedNumber.toString())
            return true;
        } catch (e) {
            console.log(e)
            task.status = "waiting for approval";
            await task.save();
            return null;
        }
    }

    async getTask(id) {
        io.robotMoved(1).then(r => console.log("moved")).catch((e)=>console.log("movement failed"))
        return Task.findOne({_id: id}).populate("room").populate("necessity").deepPopulate("room.map", "map.password:0");
    }
}

module.exports = new TaskRepo();