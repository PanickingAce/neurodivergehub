const express = require("express");
const router = express.Router();

const {
  getTasks,
  addTask,
  deleteTask,
  toggleTask,
  updateTask
} = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", addTask);
router.put("/:id", toggleTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);


module.exports = router;