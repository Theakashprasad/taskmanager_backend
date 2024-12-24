"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const taskModel_1 = __importDefault(require("../domain/model/taskModel"));
dotenv_1.default.config();
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.MY_SECRET;
const verifyJWT = (token) => {
    const newToken = JSON.parse(token);
    try {
        return jwt.verify(newToken, JWT_SECRET_KEY);
    }
    catch (error) {
        return null;
    }
};
const addTaskHandler = (socket_1, _a) => __awaiter(void 0, [socket_1, _a], void 0, function* (socket, { userTask, token }) {
    try {
        const decoded = verifyJWT(token);
        if (!decoded) {
            socket.emit("error", "Invalid token");
            return;
        }
        const newTask = new taskModel_1.default({
            userId: decoded.id,
            title: userTask.title,
            description: userTask.description,
        });
        yield newTask.save();
        socket.emit("taskAdded", newTask);
        socket.broadcast.emit("taskAdded", newTask);
    }
    catch (error) {
        console.error("Error adding task:", error);
    }
});
const getTasksHandler = (socket, token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('fromt he get task handeler');
    try {
        const decoded = verifyJWT(token);
        if (!decoded) {
            socket.emit("error", "Invalid token");
            return;
        }
        const tasks = yield taskModel_1.default.find({ userId: decoded.id }).sort({ createdAt: -1 });
        socket.emit("fetchTask", tasks);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
    }
});
const toggleTaskCompletionHandler = (socket_1, _a) => __awaiter(void 0, [socket_1, _a], void 0, function* (socket, { token, userId }) {
    try {
        const decoded = verifyJWT(token);
        if (!decoded) {
            socket.emit("error", "Invalid token");
            return;
        }
        const task = yield taskModel_1.default.findById(userId);
        if (!task) {
            socket.emit("error", "Task not found");
            return;
        }
        task.isCompleted = !task.isCompleted;
        yield task.save();
        socket.emit("taskUpdated", {
            success: task.isCompleted,
            message: task.isCompleted ? "Task marked as completed" : "Task marked as incomplete",
            id: task._id
        });
        socket.broadcast.emit("taskUpdated", {
            success: task.isCompleted,
            message: task.isCompleted ? "Task marked as completed" : "Task marked as incomplete",
            id: task._id
        });
    }
    catch (error) {
        console.error("Error updating task:", error);
        socket.emit("error", "Error updating task");
    }
});
const deleteTaskHandler = (socket, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await TaskModel.findByIdAndDelete(id);
        socket.emit("taskDeleted", id);
        socket.broadcast.emit("taskDeleted", id);
    }
    catch (error) {
        console.error("Error deleting task:", error);
        socket.emit("error", "Error deleting task");
    }
});
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
