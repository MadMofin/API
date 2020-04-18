const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Hospital = require("../models/Hospital");

//@desc Get all Hospitals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get single Hospital
//@route GET /api/v1/hospitals/:id
//@access Public
exports.getHospital = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id)

  if (!hospital) {
    return next(
      new ErrorResponse(`Hospital not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: hospital
  });
});

//@desc Add Hospital
//@route POST /api/v1/hospitals
//@access Private
exports.createHospital = asyncHandler(async (req, res, next) => {
  
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published Hospital
  const publishedHospital = await Hospital.findOne({ user: req.user.id });

  // If user is not an admin, they can only add one Make
  if (publishedHospital && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        ` The user with id ${req.user.id} has already published a Hospital`,
        400
      )
    );
  }

  const hospital = await Hospital.create(req.body);

  res.status(201).json({
    success: "true",
    data: hospital
  });

});

//@desc Update single Hospital
//@route PUT /api/v1/hospitals/:id
//@access Private
exports.updateHospital = asyncHandler(async (req, res, next) => {

  let hospital = await Hospital.findById(req.params.id);

  if (!hospital){
    return next(
      new ErrorResponse(`Hospital not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Hospital Owner
  if (hospital.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorize to update this Hospital`,
        401
      )
    );
  }

  hospital = await Hospital.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: hospital
  });
});

//@desc Delete hospital
//@route DELETE /api/v1/hospitals/:id
//@access Private
exports.deleteHospital = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital){
    return next(
      new ErrorResponse(`Hospital not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Hospital Owner
  if (hospital.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to delete this Hospital`,
        401
      )
    );
  }

  await hospital.remove();

  res.status(200).json({
    success: true,
    data: {}
  });

});