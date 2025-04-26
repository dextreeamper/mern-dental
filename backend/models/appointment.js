const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  dentistId: { type: mongoose.Types.ObjectId, required: true, ref: "Dentist" },
  date: { type: String, require: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", userSchema);
