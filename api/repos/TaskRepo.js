const Task = require("../models/Task");
class TaskRepo {
    async createTask(task, token){
        const taskCreated = Task.create({
            room: token._id,
            orderType: task.orderType,
            necessity: task.necessity,
            description: task.description,
        });
        if(!taskCreated)
            return "failed to create task";
        return true;
    }

    async deleteTask(id){
        //todo initiate emergency stop for the robot
        return Task.deleteOne({_id:id});
    }

    async getTasks(id,skip,limit){
        return Task.find({room:id}).skip(parseInt(skip)).limit(parseInt(limit)).populate("room",{password:0}).populate("necessity");
    }

    async acceptTask(task){
        task.status = "accepted";
        return await task.save();
    }

    async getTask(id){
        return Task.findOne({_id:id}).populate("room",{password:0}).populate("necessity");
    }
}
module.exports = new TaskRepo();