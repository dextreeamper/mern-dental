const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Dentist = require("../models/dentist");

const createDentist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, specialization, email } = req.body;

  let existingDentist;
  try {
    existingDentist = await Dentist.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Creating dentist failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingDentist) {
    const error = new HttpError(
      "Dentist exists already, please add a new dentist instead.",
      422
    );
    return next(error);
  }

  const createdDentist = new Dentist({
    name,
    specialization,
    email,
  });

  try {
    await createdDentist.save();
  } catch (err) {
    const error = new HttpError(
      "Creating dentist failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    name: createdDentist.name,
    specialization: createdDentist.specialization,
    email: createdDentist.email,
  });
};

const getAllDentists = async (req, res, next) => {
  let dentists;
  try {
    dentists = await Dentist.find({});
  } catch (err) {
    const error = new HttpError("Fetching dentists failed, please try again.");
    return next(error);
  }

  res.json({
    dentists: dentists.map((dentist) => dentist.toObject({ getters: true })),
  });
};

const getDentistById = async (req, res, next) => {
  const dentistId = req.params.did;

  let dentist;
  try {
    dentist = await Dentist.findById(dentistId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a dentist.",
      500
    );
    return next(error);
  }

  if (!dentist) {
    const error = new HttpError(
      "Could not find a dentist for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ dentist: dentist.toObject({ getters: true }) });
};

const updateDentist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, specialization, email } = req.body;
  const dentistId = req.params.did;

  let dentist;

  try {
    dentist = await Dentist.findById(dentistId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update dentist.",
      500
    );
    return next(error);
  }

  //   if (dentist.userId.toString() !== req.userData.userId) {
  //     const error = new HttpError(
  //       "You are not allowed to edit this profile.",
  //       401
  //     );
  //     return next(error);
  //   }

  dentist.name = name;
  dentist.specialization = specialization;
  dentist.email = email;

  try {
    await dentist.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update dentist profile.",
      500
    );
    return next(error);
  }

  res.status(200).json({ dentist: dentist.toObject({ getters: true }) });
};

const deleteDentist = async (req, res, next) => {
  const dentistId = req.params.did;

  let dentist;
  try {
    dentist = await Dentist.findByIdAndDelete(dentistId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete dentist.",
      500
    );
    return next(error);
  }

  if (!dentist) {
    const error = new HttpError("Could not find dentist for this id.", 404);
    return next(error);
  }

  res.status(200).json({ message: "Dentist deleted." });
};

exports.createDentist = createDentist;
exports.getAllDentists = getAllDentists;
exports.getDentistById = getDentistById;
exports.updateDentist = updateDentist;
exports.deleteDentist = deleteDentist;
