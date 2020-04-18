const express = require("express");

const {
  getHospitals,
  getHospital,
  createHospital,
  deleteHospital,
  updateHospital
} = require("../controllers/hospitals");

const Hospital = require("../models/Hospital");

//Include other resource routers
const doctorRouter = require("./doctors");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

//Re-routes into other resource routers
router.use("/:hospitalId/doctors", doctorRouter);

router
  .route("/")
  .get(advancedResults(Hospital, {
    path: "doctors",
    model: "Doctor",
  }), getHospitals)
  .post(protect, authorize("admin", "publisher"), createHospital);

router
  .route("/:id")
  .get(getHospital)
  .delete(protect, authorize("admin", "publisher"), deleteHospital)
  .put(protect, authorize("admin", "publisher"), updateHospital);

module.exports = router;