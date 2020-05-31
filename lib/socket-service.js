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
      // send to frontend to update state of chat view
      io.sockets.in(roomId).emit("newMessage", { sender, content, createdAt });
      // create message in db and update chat PUT action for adding message to chat model
      // const updateChat = async () => {
      ChatMessage.create({
        sender: sender._id,
        content
      }).then((message) => {
        ChatRoom.findByIdAndUpdate(
          { _id: roomId },
          { $push: { messages: message._id } }
        );
      });
      // const messageId = message._id;
      // updateChat();
      //   ChatRoom.updateMany(
      //     { _id: roomId },
      //     { $push: { messages: message._id } }
      //   );
      //   const chatToUpdate = await ChatRoom.findById(roomId);
      //   chatToUpdate.update({ $push: { messages: message._id } });
      // ChatRoom.update({ _id: roomId }, { $push: { messages: message._id } });
    });
  });
}

module.exports = socketService;
