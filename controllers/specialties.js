const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Specialty = require("../models/Specialty");

//@desc Get all Specialties
//@route GET /api/v1/specialties
//@access Public
exports.getSpecialties = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get single Specialty
//@route GET /api/v1/specialties/:id
//@access Public
exports.getSpecialty = asyncHandler(async (req, res, next) => {
  const specialty = await Specialty.findById(req.params.id)

  if (!specialty) {
    return next(
      new ErrorResponse(`Specialty not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: specialty
  });
});

//@desc Add Specialty
//@route POST /api/v1/specialties
//@access Private
exports.createSpecialty = asyncHandler(async (req, res, next) => {

  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published Hospital
  const publishedSpecialty = await Specialty.findOne({ user: req.user.id });
  
  // If user is not an admin, they can only add one Make
  if (publishedSpecialty && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        ` The user with id ${req.user.id} has already published a Specialty`,
        400
      )
    );
  }

  const specialty = await Specialty.create(req.body);

  res.status(201).json({
    success: "true",
    data: specialty
  });

});

//@desc Update single Specialty
//@route PUT /api/v1/specialties/:id
//@access Private
exports.updateSpecialty = asyncHandler(async (req, res, next) => {

  let specialty = await Specialty.findById(req.params.id);

  if (!specialty){
    return next(
      new ErrorResponse(`Specialty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Specialty Owner
  if (specialty.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to update this Specialty`,
        401
      )
    );
  }

  specialty = await Specialty.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: specialty
  });
});

//@desc Delete Specialty
//@route DELETE /api/v1/specialties/:id
//@access Private
exports.deleteSpecialty = asyncHandler(async (req, res, next) => {
  const specialty = await Specialty.findById(req.params.id);

  if (!specialty){
    return next(
      new ErrorResponse(`Specialty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Specialty Owner
  if (specialty.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to delete this Specialty`,
        401
      )
    );
  }

  await specialty.remove();

  res.status(200).json({
    success: true,
    data: {}
  });

});