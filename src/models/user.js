const Mongoose = require("mongoose");

const User = new Mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: String,
    autharmor: {
      profileId: String
    },
    accountType: {
      type: String,
      enum: ["passwordless", "2fa"]
    }
  },
  {
    timestamps: true
  }
);

const model = Mongoose.model("User", User);

module.exports = model;
