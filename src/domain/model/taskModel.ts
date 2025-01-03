import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
