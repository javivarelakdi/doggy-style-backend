/* eslint-disable no-underscore-dangle */
const express = require("express");
const { checkIfLoggedIn } = require("../middlewares");
const User = require("../models/user");

const router = express.Router();

router.use(checkIfLoggedIn);

// return list of users
router.get("/", (req, res, next) => {
  User.find()
    .populate("location")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
});

// update user POST action for adding favs and fans
router.post("/favs/:targetUserId", async (req, res, next) => {
  const { currentUser } = req.session;
  const { status } = req.body;
  const { targetUserId } = req.params;
  if (status === "true") {
    try {
      await User.update(
        { _id: currentUser._id },
        { $push: { favs: targetUserId } }
      );
      await User.update(
        { _id: targetUserId },
        { $push: { fans: currentUser._id } }
      );
      const userWithFav = await User.findById(currentUser._id);
      res.status(200).json(userWithFav);
    } catch (error) {
      next(error);
    }
  } else if (status === "false") {
    try {
      await User.update(
        { _id: currentUser._id },
        { $pull: { favs: targetUserId } }
      );
      await User.update(
        { _id: targetUserId },
        { $pull: { fans: currentUser._id } }
      );
      const userWithFav = await User.findById(currentUser._id);
      res.status(200).json(userWithFav);
    } catch (error) {
      next(error);
    }
  }
});

// shows specific user populated with fans and favs
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate("favs")
    .populate("fans")
    .populate("location")
    .then(user => {
      res.status(200).json(user);
    })
    .catch(next);
});

// update profile POST action
router.post("/:id", async (req, res, next) => {
  const { imgUrl, breed, birth, about, gender } = req.body;
  const { id } = req.params;
  try {
    await User.update(
      { _id: id },
      { $set: { imgUrl, breed, birth, about, gender } }
    );
    const editedUser = await User.findById(id);
    res.status(200).json(editedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
