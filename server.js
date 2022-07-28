const io = require("socket.io")(9999, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("message", function (message) {
    io.emit("message", message);
  });
});
