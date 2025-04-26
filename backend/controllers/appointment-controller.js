const HttpError = require("../models/http-error");
const Appointment = require("../models/appointment");
const { validationResult } = require("express-validator");

const getAllAppointments = async (req, res, next) => {
  let appointments;
  try {
    appointments = await Appointment.find().populate("userId dentistId");
  } catch (err) {
    const error = new HttpError(
      "Fetching appointments failed, please try again."
    );
    return next(error);
  }

  res.json({
    appointments: appointments.map((appointment) =>
      appointment.toObject({ getters: true })
    ),
  });
};

const createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { userId, dentistId, date, time, reason } = req.body;

  let existingAppointment;

  try {
    existingAppointment = await Appointment.findOne({ dentistId, date, time });
  } catch (err) {
    const error = new HttpError(
      "Creating appointment failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingAppointment) {
    const error = new HttpError(
      `The ${time} on ${date} is already booked for this dentist.`,
      422
    );
    return next(error);
  }

  const createdAppointment = new Appointment({
    userId,
    dentistId,
    date,
    time,
    reason,
  });

  try {
    await createdAppointment.save();
  } catch (err) {
    const error = new HttpError(
      "Creating appointment failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ createdAppointment });
};

const getAppointmentById = async (req, res, next) => {
  const appointmentId = req.params.aid;

  let appointment;
  try {
    appointment = await Appointment.findById(appointmentId).populate(
      "userId dentistId"
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an appointment.",
      500
    );
    return next(error);
  }

  if (!appointment) {
    const error = new HttpError(
      "Could not find an appointment for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ appointment: appointment.toObject({ getters: true }) });
};

const updateAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { date, time, reason } = req.body;
  const appointmentId = req.params.aid;

  let appointment;

  try {
    appointment = await Appointment.findById(appointmentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the appointment.",
      500
    );
    return next(error);
  }

  if (appointment.userId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to update this appointment.",
      401
    );
    return next(error);
  }

  appointment.date = date;
  appointment.time = time;
  appointment.reason = reason;

  try {
    await appointment.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the appointment.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ appointment: appointment.toObject({ getters: true }) });
};

const deleteAppointment = async (req, res, next) => {
  const appointmentId = req.params.aid;

  let appointment;
  try {
    appointment = await Appointment.findByIdAndDelete(appointmentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete appointment.",
      500
    );
    return next(error);
  }

  if (!appointment) {
    const error = new HttpError("Could not find appointment for this id.", 404);
    return next(error);
  }

  res.status(200).json({ message: "Appointment deleted." });
};

exports.getAllAppointments = getAllAppointments;
exports.createAppointment = createAppointment;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
