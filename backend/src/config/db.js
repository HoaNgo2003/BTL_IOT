const MONGODB_URL =
  "mongodb+srv://hoango:HoaNgo1610@cluster0.fs0fkqb.mongodb.net/iot";
const mongoose = require("mongoose");
const connectDb = () => {
  console.log("oke");
  return mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 giây
  });
};
module.exports = { connectDb };
