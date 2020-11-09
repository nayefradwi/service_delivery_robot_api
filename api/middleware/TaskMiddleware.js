const TaskRepo = require("../repos/TaskRepo")
class TaskMiddleware {

    async getTask(req,res, next){
        try {
            const task = await TaskRepo.getTask(req.params.taskId);
            if (!task)
                return res.status(400).send("task not found")
            req.task = task;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async authorized(req,res, next){
        try {
           if(req.task.room._id.toString() === req.token._id.toString())
               return next();
            return res.status(400).send("not authorized")
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new TaskMiddleware()