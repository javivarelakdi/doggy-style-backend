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
  const { isFav } = req.body;
  const { targetUserId } = req.params;
  if (isFav === true) {
    try {
      await User.findByIdAndUpdate(
        currentUser._id,
        { $push: { favs: targetUserId } },
        { new: true }
      );
      const favUser = await User.findByIdAndUpdate(
        { _id: targetUserId },
        { $push: { fans: currentUser._id } },
        { new: true }
      )
        .populate("favs")
        .populate("fans");
      res.status(200).json(favUser);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      await User.findByIdAndUpdate(
        currentUser._id,
        { $pull: { favs: targetUserId } },
        { new: true }
      );
      const favUser = await User.findByIdAndUpdate(
        { _id: targetUserId },
        { $pull: { fans: currentUser._id } },
        { new: true }
      )
        .populate("favs")
        .populate("fans");
      res.status(200).json(favUser);
    } catch (error) {
      next(error);
    }
  }
});

// shows specific user populated with fans and favs and events
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate("favs")
    .populate("fans")
    .populate("location")
    .populate({
      path: "events",
      limit: 3,
      sort: {
        date: -1 // Sort by Date Added DESC
      }
    })
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
    const editedUser = await User.findByIdAndUpdate(
      id,
      { $set: { imgUrl, breed, birth, about, gender } },
      { new: true }
    );
    res.status(200).json(editedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
