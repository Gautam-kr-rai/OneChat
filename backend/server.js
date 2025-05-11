import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import connectDB from "./db/db.js";
import authRoutes from "./routes/authroute.js";
import messageRoutes from "./routes/messageroute.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
   cors: {
      origin:process.env.FrontendLink,
      methods:["GET", "POST"],
      credentials:true
   }
})
 
const onlineUsers = new Map();

io.on("connection", (socket) => {
  
  // console.log("Socket connected:", socket.id);
  // Join room (used by both user/admin)
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.emit("joined", `Joined room ${roomId}`);
  });

  // Handle user message
  socket.on("message", ({ message, room }) => {
    io.to(room).emit("receive-message", message);
  });

  // Track online user
  socket.on("user-online", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Allow client to request current online users manually (e.g. on page load)
  socket.on("get-online-users", () => {
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Typing indicator
  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user-typing", { username });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys())); // update all clients
  });
});


app.use(cors({
  origin:process.env.FrontendLink,
      methods:["GET", "POST"],
      credentials:true
}))
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
