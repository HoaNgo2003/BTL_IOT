const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
