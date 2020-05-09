/* eslint-disable no-underscore-dangle */
const express = require("express");
const bcrypt = require("bcrypt");

const { checkUsernameAndPasswordNotEmpty } = require("../middlewares");

const User = require("../models/user");
const Location = require("../models/location");

const bcryptSalt = 10;

const router = express.Router();

router.get("/whoami", (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(401).json({ code: "unauthorized" });
  }
});

router.post(
  "/signup",
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const {
      username,
      password,
      imgUrl,
      breed,
      birth,
      gender,
      about,
      lng,
      lat
    } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      if (user) {
        return res.status(422).json({ code: "username-not-unique" });
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const location = await Location.create({ coordinates: [lng, lat] });
      const newUser = await User.create({
        username,
        password: hashedPassword,
        imgUrl,
        breed,
        birth,
        gender,
        about,
        location
      });
      req.session.currentUser = newUser;
      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { username, password, lng, lat } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ code: "not-found" });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        await Location.findByIdAndUpdate(user.location, {
          $set: { coordinates: [lng, lat] }
        });
        const updatedUser = await User.findById(user.id);
        res.status(200).json(updatedUser);
      }
      return res.status(404).json({ code: "not-found" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    return res.status(204).send();
  });
});

module.exports = router;
