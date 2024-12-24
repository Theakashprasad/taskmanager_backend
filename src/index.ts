const express = require("express");
const http = require("http");
import mongoDB from "./domain/dbConfig";
const cors = require("cors");
const { Server } = require("socket.io");
import dotenv from "dotenv";
import authrouter from "./presentation/router/authrouter";

const {
  addTaskHandler,
  getTasksHandler,
  toggleTaskCompletionHandler,
  deleteTaskHandler,
  editTaskHandler,
} = require("./handlers/socketHandlers");
const app = express();
dotenv.config();

/////////////////////// CORS SOCKET
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Your React frontend URL
      "https://taskmanager-frontend-6rmh.vercel.app", // Add other allowed origins if needed
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // If sending cookies or authorization headers
  },
});

/////////////////////// CORS
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskmanager-frontend-6rmh.vercel.app",
    ],
    methods: ["GET", "POST"],  // Array format
    credentials: true,
  })
);

///////////////////////REGISTER
app.use("/api/", authrouter);

///////////////////////SOCKET CONNECTion
io.on("connection", (socket: any) => {
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
  mongoDB();
  console.log("Server running on http://localhost:3000");
});
