const mongoose = require("mongoose");

const ConsultSchema = new mongoose.Schema(
  {
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required: true
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true,
        maxlength: [254, "Description can not be more than 254 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    id: false 
  }
);

module.exports = mongoose.model("Consult", ConsultSchema);