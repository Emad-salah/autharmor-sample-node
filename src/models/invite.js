const Mongoose = require("mongoose");

const Invite = new Mongoose.Schema(
  {
    username: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    expiresAt: Date
  },
  {
    timestamps: true
  }
);

Invite.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

const model = Mongoose.model("Invite", Invite);

module.exports = model;
