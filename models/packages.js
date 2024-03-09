const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  daily: {
    type: Number,
    required: true,
  },
  hourly: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Package", packageSchema);
