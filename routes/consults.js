const express = require("express");

const {
  getConsults,
  getConsult,
  createConsult,
  deleteConsult,
  updateConsult
} = require("../controllers/consults");

const Consult = require("../models/Consult");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Consult, [{
      path: 'hospital',
      model: 'Hospital'
  },{
    path: 'doctor',
    model: 'Doctor'
  },{
    path: 'user',
    model: 'User'
  }]), getConsults)

  router
  .route("/:doctorId/:hospitalId")
  .post(protect, authorize("admin", "publisher"), createConsult);

router
  .route("/:id")
  .get(getConsult)
  .delete(protect, authorize("admin", "publisher"), deleteConsult)
  .put(protect, authorize("admin", "publisher"), updateConsult);

module.exports = router;