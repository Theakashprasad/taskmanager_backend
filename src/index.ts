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


/////////////////////// CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://taskmanager-rose-six.vercel.app",
      "http://localhost:5173",
      'https://taskmanager-git-main-akashs-projects-848d32a6.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

/////////////////////// CORS SOCKET

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://taskmanager-rose-six.vercel.app",
      "http://localhost:5173",
      'https://taskmanager-git-main-akashs-projects-848d32a6.vercel.app'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

///////////////////////REGISTER
app.use("/api/", authrouter);

///////////////////////SOCKET CONNECTion
io.on("connection", (socket: any) => {
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
