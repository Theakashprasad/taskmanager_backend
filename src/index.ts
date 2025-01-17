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
const server = http.createServer(app);

/////////////////////// CORS
app.use(cors({
  origin: [
    "https://taskmanager-pleu58j0i-akashs-projects-848d32a6.vercel.app",
    "https://taskmanager-rose-six.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/////////////////////// CORS SOCKET
const io = new Server(server, {
  cors: {
    origin: "https://taskmanager-rose-six.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    transports: ['websocket', 'polling']
  },
  allowEIO3: true, // Enable Socket.IO v3 compatibility
  pingTimeout: 60000,
  pingInterval: 25000
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
app.options('*', cors());

server.listen(3000, () => {
  mongoDB();
  console.log("Server running on http://localhost:3000");
});
