const TaskRepo = require("../repos/TaskRepo");
class TaskController {
  async createTask(req, res) {
    try {
      const taskCreated = await TaskRepo.createTask(req.body, req.token);
      if (typeof taskCreated === "string")
        return res.status(400).send(taskCreated);
      if (!taskCreated) return res.status(400).send("failed to create task");
      return res.send(taskCreated);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async deleteTask(req, res) {
    try {
      const taskDeleted = await TaskRepo.deleteTask(req.params.taskId);
      if (!taskDeleted) return res.status(400).send("failed to delete");
      return res.send(true);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async deleteTaskNurse(req, res) {
    try {
      const taskDeleted = await TaskRepo.deleteTaskNurse(
        req.params.taskId,
        req.nurse.hospital._id
      );
      if (!taskDeleted) return res.status(400).send("failed to delete");
      return res.send(true);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async getTasksOfRoom(req, res) {
    try {
      let skip = req.query.skip === undefined ? 0 : req.query.skip;
      let limit = req.query.limit === undefined ? 10 : req.query.limit;
      const tasks = await TaskRepo.getTasks(req.token._id, skip, limit);
      if (!tasks) return res.status(400).send("couldn't load tasks");
      return res.send(tasks);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async acceptTask(req, res) {
    try {
      const taskDeleted = await TaskRepo.acceptTask(req.task);
      if (!taskDeleted) return res.status(400).send("failed to accept");
      return res.send(true);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async getTask(req, res) {
    try {
      const task = await TaskRepo.getTask(req.params.taskId);
      if (!task) return res.status(400).send("task not found");
      return res.json(task);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }

  async getTasksForNurse(req, res) {
    try {
      const task = await TaskRepo.getTasksForNurse(req.nurse.hospital._id);
      if (!task) return res.status(400).send("task not found");
      return res.json(task);
    } catch (e) {
      console.log(e);
      return res.status(400).send("an error occurred");
    }
  }
}

module.exports = new TaskController();
