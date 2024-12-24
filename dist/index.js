"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const dbConfig_1 = __importDefault(require("./domain/dbConfig"));
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const authrouter_1 = __importDefault(require("./presentation/router/authrouter"));
const { addTaskHandler, getTasksHandler, toggleTaskCompletionHandler, deleteTaskHandler, editTaskHandler, } = require("./handlers/socketHandlers");
const app = express();
dotenv_1.default.config();
/////////////////////// CORS SOCKET
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", // Your React frontend URL
            "https://your-other-frontend-url.com", // Add other allowed origins if needed
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // If sending cookies or authorization headers
    },
});
/////////////////////// CORS
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://inventory-frontend-kappa-liart.vercel.app",
        "https://inventory-frontend-4kqb7knr4-akashs-projects-848d32a6.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
///////////////////////REGISTER
app.use("/api/", authrouter_1.default);
///////////////////////SOCKET CONNECTion
io.on("connection", (socket) => {
    console.log("A user connected", socket);
    socket.on("addTask", addTaskHandler.bind(null, socket));
    socket.on("getTasks", getTasksHandler.bind(null, socket));
    socket.on("isCompleted", toggleTaskCompletionHandler.bind(null, socket));
    socket.on("deleteTask", deleteTaskHandler.bind(null, socket));
    // socket.on("handleTaskEdit", editTaskHandler.bind(null, socket));
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
server.listen(3000, () => {
    (0, dbConfig_1.default)();
    console.log("Server running on http://localhost:3000");
});
