/* eslint-disable no-underscore-dangle */
const express = require("express");

const router = express.Router();
const ChatRoom = require("../models/room");
const ChatMessage = require("../models/message");

// fetch list of chats
router.get("/", (req, res, next) => {
  ChatRoom.find()
    .populate("users")
    .populate("messages")
    .then(chats => {
      res.status(200).json(chats);
    })
    .catch(next);
});

// show specific chat
router.get("/:id", (req, res, next) => {
  ChatRoom.findById(req.params.id)
    .populate("users")
    .populate("messages")
    .then(chat => {
      res.status(200).json(chat);
    })
    .catch(next);
});

// create chat POST action
router.post("/new", async (req, res, next) => {
  const { targetUserId } = req.body;
  const currentUserId = req.session.currentUser._id;
  try {
    const chat = await ChatRoom.create({
      users: [targetUserId, currentUserId],
      messages: []
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
});

// update chat PUT action for adding message
router.put("/:id", async (req, res, next) => {
  const { content, senderId } = req.body;
  const { id } = req.params;
  try {
    const message = await ChatMessage.create({ sender: senderId, content });
    await ChatRoom.update({ _id: id }, { $push: { messages: message._id } });
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
