import { Socket } from "socket.io";
import dotenv from "dotenv";
import TaskModel from "../domain/model/taskModel";
dotenv.config();
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.MY_SECRET as string;

interface UserTask {
  id: string;
  title: string;
  description: string;
}

interface AddTaskPayload {
  userId: string;
  userTask: UserTask;
  token: string;
}

const verifyJWT = (token: any) => {
  const newToken = JSON.parse(token);
  try {
    return jwt.verify(newToken, JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const addTaskHandler = async (
  socket: Socket,
  { userTask, token }: AddTaskPayload
) => {
  try {
    const decoded = verifyJWT(token);

    if (!decoded) {
      socket.emit("error", "Invalid token");
      return;
    }

    const newTask = new TaskModel({
      userId: decoded.id,
      title: userTask.title,
      description: userTask.description,
    });
    await newTask.save();
    socket.emit("taskAdded", newTask);
    socket.broadcast.emit("taskAdded", newTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

const getTasksHandler = async (socket: Socket, token: AddTaskPayload) => {
  console.log("fromt he get task handeler");

  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      socket.emit("error", "Invalid token");
      return;
    }

    const tasks = await TaskModel.find({ userId: decoded.id }).sort({
      createdAt: -1,
    });
    socket.emit("fetchTask", tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const toggleTaskCompletionHandler = async (
  socket: Socket,
  { token, userId }: AddTaskPayload
) => {
  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      socket.emit("error", "Invalid token");
      return;
    }

    const task = await TaskModel.findById(userId);
    if (!task) {
      socket.emit("error", "Task not found");
      return;
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    socket.emit("taskUpdated", {
      success: task.isCompleted,
      message: task.isCompleted
        ? "Task marked as completed"
        : "Task marked as incomplete",
      id: task._id,
    });
    socket.broadcast.emit("taskUpdated", {
      success: task.isCompleted,
      message: task.isCompleted
        ? "Task marked as completed"
        : "Task marked as incomplete",
      id: task._id,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    socket.emit("error", "Error updating task");
  }
};

const deleteTaskHandler = async (socket: Socket, id: string, token: string) => {
  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      socket.emit("error", "Invalid token");
      return;
    }
    socket.emit("taskDeleted", id);
    socket.broadcast.emit("taskDeleted", id);
  } catch (error) {
    console.error("Error deleting task:", error);
    socket.emit("error", "Error deleting task");
  }
};

// const editTaskHandler = async (socket, { editingTask, editableTaskTitle, token }) => {
//   try {
//     const decoded = verifyJWT(token);
//     if (!decoded) {
//       socket.emit("error", "Invalid token");
//       return;
//     }

//     const task = await TaskModel.findById(editingTask._id);
//     if (!task) {
//       socket.emit("error", "Task not found");
//       return;
//     }

//     task.title = editableTaskTitle;
//     await task.save();

//     socket.emit("taskUpdated", { success: true, message: "Task updated" });
//   } catch (error) {
//     console.error("Error editing task:", error);
//     socket.emit("error", "Error editing task");
//   }
// };

module.exports = {
  addTaskHandler,
  getTasksHandler,
  toggleTaskCompletionHandler,
  deleteTaskHandler,
  // editTaskHandler,
};
