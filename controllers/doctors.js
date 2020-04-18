const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Doctor = require("../models/Doctor");

//@desc Get all Doctors
//@route GET /api/v1/doctors
//@route GET /api/v1/hospital/:hospitalId/doctors
//@route GET /api/v1/specialties/:specialtyId/doctors
//@access Public
exports.getDoctors = asyncHandler(async (req, res, next) => {
    if (req.params.hospitalId) {
      const doctors = await Doctor.find({ hospital: req.params.hospitalId });

      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } else if(req.params.specialtyId){
      const doctors = await Doctor.find({ specialty: req.params.specialtyId });

      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } else{
      res.status(200).json(res.advancedResults);
    }
  });

//@desc Get single Doctor
//@route GET /api/v1/doctors/:id
//@access Public
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)

  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: doctor
  });
});

//@desc Add Doctor
//@route POST /api/v1/hospitals/:hospitalId/doctors
//@access Private
exports.createDoctor = asyncHandler(async (req, res, next) => {

  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published Hospital
  const publishedDoctor = await Doctor.findOne({ user: req.user.id });
  
  // If user is not an admin, they can only add one Make
  if (publishedDoctor && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        ` The user with id ${req.user.id} has already published a Doctor`,
        400
      )
    );
  }

  req.body.hospital = req.params.hospitalId;

  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: "true",
    data: doctor
  });

});

//@desc Update single Doctor
//@route PUT /api/v1/doctors/:id
//@access Private
exports.updateDoctor = asyncHandler(async (req, res, next) => {

  let doctor = await Doctor.findById(req.params.id);

  if (!doctor){
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Doctor Owner
  if (doctor.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to update this Doctor`,
        401
      )
    );
  }

  doctor = await Doctor.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: doctor
  });
});

//@desc Delete Doctor
//@route DELETE /api/v1/doctors/:id
//@access Private
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor){
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Doctor Owner
  if (doctor.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to delete this Doctor`,
        401
      )
    );
  }

  await doctor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });

});