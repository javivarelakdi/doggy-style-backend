const mongoose = require("mongoose");

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    date: { type: Date, required: true },
    initTime: { type: String, required: true },
    endTime: { type: String, required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
