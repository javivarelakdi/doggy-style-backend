const SocketIO = require("socket.io");
const ChatRoom = require("../models/room");
const ChatMessage = require("../models/message");

function socketService(server) {
  const io = SocketIO(server);

  io.sockets.on("connection", socket => {
    socket.on("join", data => {
      socket.join(data.id); // We are using room of socket io
    });
    socket.on("newMessage", data => {
      const { roomId, sender, content, createdAt } = data;
      // create message in db and update chat PUT action for adding message to chat model
      ChatMessage.create({ sender: sender._id, content })
        .then(async chat => {
          await ChatRoom.findByIdAndUpdate(
            roomId,
            { $push: { messages: chat._id } },
            { new: true }
          );
          // send to frontend to update state of chat view
          io.sockets
            .in(roomId)
            .emit("newMessage", { sender, content, createdAt });
        })
        .catch();
    });
  });
}

module.exports = socketService;
