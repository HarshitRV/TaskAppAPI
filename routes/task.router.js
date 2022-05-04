const { Router } = require("express");
const TaskRouter = Router();

const { 
    createTask, 
    getAllTasks, 
    getTaskById,
    updateTaskById,
    deleteTaskById 
} = require("../controllers/task/task.controller");

TaskRouter.route("/tasks")
    .get(getAllTasks)
    .post(createTask)

TaskRouter.route("/tasks/:id")
    .get(getTaskById)
    .patch(updateTaskById)
    .delete(deleteTaskById)
  

module.exports = TaskRouter;