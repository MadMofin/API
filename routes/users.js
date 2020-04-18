const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(protect, authorize("admin", "publisher"), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("admin", "publisher"), updateUser)
  .delete(protect, authorize("admin", "publisher"), deleteUser);

module.exports = router;