import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

// Initialize onlineUser array
let onlineUser = [];

const addUser = (userId, socketId) => {
  try {
    const userExists = onlineUser.find((user) => user.userId === userId);

    if (!userExists) {
      onlineUser.push({ userId, socketId });
      console.log("User added:", userId, socketId);
      console.log("Current online users:", onlineUser);
    }
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const removeUser = (socketId) => {
  try {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
    console.log("User removed:", socketId);
    console.log("Current online users:", onlineUser);
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

const getUser = (userId) => {
  try {
    const user = onlineUser.find((user) => user.userId === userId);
    console.log("Getting user:", userId, user);
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("newUser", (userId) => {
    console.log("New user event:", userId);
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    try {
      console.log("Message sent to:", receiverId, data);
      const user = getUser(receiverId);

      if (user) {
        console.log("Sending message to socket:", user.socketId);
        io.to(user.socketId).emit("getMessage", data);
      } else {
        console.log("User not found:", receiverId);
        // Optionally store the message for when the user comes online
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUser(socket.id);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

io.listen("4000");
