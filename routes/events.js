/* eslint-disable no-underscore-dangle */
const express = require("express");

const router = express.Router();
const Event = require("../models/event");
const User = require("../models/user");
const Location = require("../models/location");

// fetch list of events
router.get("/", (req, res, next) => {
  Event.find()
    .sort("date")
    .populate("owner")
    .populate("attendees")
    .populate("location")
    .then(events => {
      res.status(200).json(events);
    })
    .catch(next);
});

// create event POST action
router.post("/new", async (req, res, next) => {
  const {
    owner,
    name,
    description,
    date,
    initTime,
    endTime,
    lng,
    lat
  } = req.body;
  try {
    const location = await Location.create({ coordinates: [lng, lat] });
    const newEvent = await Event.create({
      owner,
      name,
      description,
      date,
      initTime,
      endTime,
      location
    });
    newEvent.populate("owner").execPopulate();
    await User.findByIdAndUpdate(
      { _id: owner._id },
      { $push: { events: newEvent._id } }
    );
    res.status(200).json(newEvent);
  } catch (error) {
    next(error);
  }
});

// show specific event
router.get("/:id", (req, res, next) => {
  Event.findById(req.params.id)
    .populate("owner")
    .populate("attendees")
    .populate("location")
    .then(event => {
      res.status(200).json(event);
    })
    .catch(next);
});

// update event POST action for adding attendee
router.post("/:id/attendee", async (req, res, next) => {
  const { isAttending } = req.body;
  const { id } = req.params;
  const attendee = req.session.currentUser._id;
  if (isAttending === true) {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          $push: { attendees: attendee }
        },
        { new: true }
      ).populate("attendees");
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          $pull: { attendees: attendee }
        },
        { new: true }
      ).populate("attendees");
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }
});

// delete event POST action
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Event.findByIdAndDelete(id);
    const { owner } = deleted;
    await User.findByIdAndUpdate(
      { _id: owner },
      { $pull: { events: deleted._id } }
    );
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

// update event POST action
router.post("/:id", async (req, res, next) => {
  const {
    name,
    description,
    date,
    initTime,
    endTime,
    locId,
    lng,
    lat
  } = req.body;

  const { id } = req.params;
  try {
    await Location.findByIdAndUpdate(
      { _id: locId },
      { $set: { coordinates: [lng, lat] } }
    );
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: { name, description, date, initTime, endTime } },
      { new: true }
    )
      .populate("attendees")
      .populate("owner")
      .populate("location");
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
