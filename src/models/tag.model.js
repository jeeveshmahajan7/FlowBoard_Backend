const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // important to avoid case sensitive duplicacy
    }, // Tag names must be unique
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
