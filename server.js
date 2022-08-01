const io = require("socket.io")(9999, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("message", function (message) {
    io.emit("message", { ...message, date: new Date() });
  });

  socket.on("user", function (data) {
    if (onlineUsers[socket.id] !== undefined) {
      return;
    }

    onlineUsers[socket.id] = data;

    updateOnlineUsers(onlineUsers);
  });

  socket.on("disconnect", function () {
    if (onlineUsers[socket.id] === undefined) {
      return;
    }

    delete onlineUsers[socket.id];

    updateOnlineUsers(onlineUsers);
  });
});

function updateOnlineUsers(users) {
  io.emit("updateOnlineUsers", users);
}
