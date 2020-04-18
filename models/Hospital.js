const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"]
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Reverse populate with virtuals
HospitalSchema.virtual("doctors", {
  ref: "Doctor",
  localField: "_id",
  foreignField: "hospital",
  justOne: false
});

module.exports = mongoose.model("Hospital", HospitalSchema);