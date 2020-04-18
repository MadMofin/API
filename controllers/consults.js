const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Consult = require("../models/Consult");

//@desc Get all Consults
//@route GET /api/v1/consults
//@route GET /api/v1/doctors/:doctorId/consults
//@route GET /api/v1/users/:userId/consults/
//@access Public
exports.getConsults = asyncHandler(async (req, res, next) => {
    if (req.params.doctorId) {
      const consult = await Consult.find({ doctor: req.params.doctorId });

      return res.status(200).json({
        success: true,
        count: consult.length,
        data: consult
      });
    } else if(req.params.userId){
      const consult = await Consult.find({ user: req.params.userId });

      return res.status(200).json({
        success: true,
        count: consult.length,
        data: consult
      });
    } else{
      res.status(200).json(res.advancedResults);
    }
  });

//@desc Get single Consult
//@route GET /api/v1/consults/:id
//@access Public
exports.getConsult = asyncHandler(async (req, res, next) => {
  const consult = await Consult.findById(req.params.id)

  if (!consult) {
    return next(
      new ErrorResponse(`Consult not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: consult
  });
});

//@desc Add Consult
//@route POST /api/v1/consult
//@access Private
exports.createConsult = asyncHandler(async (req, res, next) => {

  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published Consult
  const publishedConsult = await Consult.findOne({ user: req.user.id });
  
  // If user is not an admin, they can only add one Consult
  if (publishedConsult && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        ` The user with id ${req.user.id} has already published a Consult`,
        400
      )
    );
  }

  const consult = await Consult.create(req.body);

  res.status(201).json({
    success: "true",
    data: consult
  });

});

//@desc Update single Consult
//@route PUT /api/v1/consults/:id
//@access Private
exports.updateConsult = asyncHandler(async (req, res, next) => {

  let consult = await Consult.findById(req.params.id);

  if (!consult){
    return next(
      new ErrorResponse(`Consult not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Consult Owner
  if (consult.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to update this Consult`,
        401
      )
    );
  }

  consult = await Consult.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: consult
  });
});

//@desc Delete Consult
//@route DELETE /api/v1/consults/:id
//@access Private
exports.deleteConsult = asyncHandler(async (req, res, next) => {
  const consult = await Consult.findById(req.params.id);

  if (!consult){
    return next(
      new ErrorResponse(`Consult not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure is Consult Owner
  if (consult.user.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorize to delete this Consult`,
        401
      )
    );
  }

  await consult.remove();

  res.status(200).json({
    success: true,
    data: {}
  });

});