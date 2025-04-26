const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dentistSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Dentist", dentistSchema);
