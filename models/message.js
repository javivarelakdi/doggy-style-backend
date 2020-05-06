const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatMessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: String
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
