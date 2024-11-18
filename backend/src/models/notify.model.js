const mongoose = require("mongoose");
const { Schema } = mongoose;
const notifiSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const Notifi = mongoose.model("notifi", notifiSchema);
module.exports = Notifi;
