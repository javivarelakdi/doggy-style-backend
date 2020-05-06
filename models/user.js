const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imgUrl: String,
    breed: String,
    birth: Date,
    about: String,
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    gender: { type: String, enum: ["female", "male", "non-binary"] },
    favs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    fans: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
