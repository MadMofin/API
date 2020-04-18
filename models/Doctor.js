const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"]
    },
    email: {
        type: String,
        unique: true,
        match: [
          /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
          "Please add a valid email"
        ],
        required: [true, "Please add an email"]
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, "Phone can not be more than 20 characters"],
        required: [true, "Please add a phone"]
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: true
    },
    specialty: {
        type: mongoose.Schema.ObjectId,
        ref: "Specialty",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },  
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    id: false 
  }
);

module.exports = mongoose.model("Doctor", DoctorSchema);