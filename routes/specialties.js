const express = require("express");

const {
  getSpecialties,
  getSpecialty,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty
} = require("../controllers/specialties");

const Specialty = require("../models/Specialty");

//Include other resource routers
const doctorRouter = require("./doctors");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

//Re-routes into other resource routers
router.use("/:specialtyId/doctors", doctorRouter);

router
  .route("/")
  .get(advancedResults(Specialty, ''), getSpecialties)
  .post(protect, authorize("admin", "publisher"), createSpecialty);

router
  .route("/:id")
  .get(getSpecialty)
  .delete(protect, authorize("admin", "publisher"), deleteSpecialty)
  .put(protect, authorize("admin", "publisher"), updateSpecialty);

module.exports = router;