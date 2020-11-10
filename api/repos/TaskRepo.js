const Task = require("../models/Task");

class TaskRepo {
    async createTask(task, token) {
        const taskCreated = Task.create({
            room: token._id,
            orderType: task.orderType,
            necessity: task.necessity,
            description: task.description,
        });
        if (!taskCreated)
            return "failed to create task";
        return true;
    }

    async deleteTask(id) {
        //todo initiate emergency stop for the robot
        return Task.deleteOne({_id: id});
    }

    async getTasks(id, skip, limit) {
        return Task.find({room: id}).sort({lastTimeStatusUpdated:-1}).skip(parseInt(skip)).limit(parseInt(limit)).populate("room", {password: 0}).populate("necessity");
    }

    async acceptTask(task) {
        task.status = "accepted";
        return await task.save();
        //todo call the microservice to get the shortest path
        //todo after getting the shortest path, use socketIO to pass the array of commands along with the destination name
    }

    async getTask(id) {
        return Task.findOne({_id: id}).populate("room").populate("necessity").deepPopulate("room.map", "map.password:0");
    }
}

module.exports = new TaskRepo();