const mongoose = require("mongoose");

const SpecialtySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
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

module.exports = mongoose.model("Specialty", SpecialtySchema);