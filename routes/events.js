/* eslint-disable no-underscore-dangle */
const express = require("express");

const router = express.Router();
const Event = require("../models/event");
const Location = require("../models/location");

// fetch list of events
router.get("/", (req, res, next) => {
  Event.find()
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
  const { status } = req.body;
  const { id } = req.params;
  const attendee = req.session.currentUser._id;
  if (status === "true") {
    try {
      await Event.update({ _id: id }, { $push: { attendees: attendee } });
      const updatedEvent = await Event.findById(id);
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      await Event.update({ _id: id }, { $pull: { attendees: attendee } });
      const updatedEvent = await Event.findById(id);
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }
});

// delete event POST action
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Event.findByIdAndDelete(id)
    .then(() => {
      Event.find()
        .then(events => {
          res.status(200).json(events);
        })
        .catch(next);
    })
    .catch(next);
});

// update event POST action
router.put("/:id", async (req, res, next) => {
  const {
    name,
    description,
    date,
    initTime,
    endTime,
    lng,
    lat,
    locId
  } = req.body;
  const { id } = req.params;
  try {
    await Location.update(
      { _id: locId },
      { $set: { coordinates: [lng, lat] } }
    );
    await Event.update(
      { _id: id },
      { $set: { name, description, date, initTime, endTime } }
    );
    const updatedEvent = await Event.findById(id);
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
