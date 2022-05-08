const { Router } = require("express");
const TaskRouter = Router();

const auth = require("../middlewares/auth");

const { 
    createTask, 
    getAllTasks, 
    getTaskById,
    updateTaskById,
    deleteTaskById 
} = require("../controllers/task/task.controller");

TaskRouter.route("/tasks")
    .get(auth, getAllTasks)
    .post(auth, createTask)

TaskRouter.route("/tasks/:id")
    .get(auth, getTaskById)
    .patch(auth, updateTaskById)
    .delete(auth, deleteTaskById)
  

module.exports = TaskRouter;