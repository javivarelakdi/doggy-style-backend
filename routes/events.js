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
  const { owner, name, description, date, initTime, endTime } = req.body;
  const lng = "2.1566780196195054";
  const lat = "2.1566780196195054";
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
    await newEvent
      .populate("attendees")
      .populate("owner")
      .populate("location");
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
      );
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
router.post("/:id", async (req, res, next) => {
  const { name, description, date, initTime, endTime, locId } = req.body;
  const lng = "2.1566780196195054";
  const lat = "2.1566780196195054";
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
