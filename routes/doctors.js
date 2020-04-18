const express = require("express");

const {
  getDoctors,
  getDoctor,
  createDoctor,
  deleteDoctor,
  updateDoctor
} = require("../controllers/doctors");

const Doctor = require("../models/Doctor");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Doctor, ''), getDoctors)
  .post(protect, authorize("admin", "publisher"), createDoctor);

router
  .route("/:id")
  .get(getDoctor)
  .delete(protect, authorize("admin", "publisher"), deleteDoctor)
  .put(protect, authorize("admin", "publisher"), updateDoctor);

module.exports = router;