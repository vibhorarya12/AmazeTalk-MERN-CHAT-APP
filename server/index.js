const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();
app.use(express.json());

const connect_db = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE);
    console.log("connected to mongo db");
  } catch (error) {
    console.log("error connecting to database", error.message);
  }
};
connect_db();
app.get("/", (req, res) => {
  res.send("welcome to chat now 2023");
});
app.use("/user", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Server is running");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});
const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    // Add the user to the onlineUsers list
    onlineUsers[userId] = socket.id;
    socket.join(userId);
    socket.emit("connected");

    // Notify other users that this user is now online
    io.emit("user online", userId);
  });

  socket.on("disconnect", () => {
    // Remove the user from the onlineUsers list
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];

      // Notify other users that this user has gone offline
      io.emit("user offline", userId);
    }
  });

  socket.on("join chat", (room) => {
    if (room === "65c9bd6eb286731a7a943ccf") {
      // Log the user's ID when they join this room
      console.log("User joined room:", socket.id);
    }
    socket.join(room);
  });

  // Server-side socket event handlers
  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

  socket.on("new message", (newMessageStatus) => {
    console.log(newMessageStatus);
    var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not found");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit("message received", newMessageStatus);
    });
  });
});
