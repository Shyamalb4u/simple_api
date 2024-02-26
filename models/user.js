const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  keyid: {
    type: String,
    required: true,
  },

  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sponsor: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  uplines: {
    type: Array,
    default: [],
  },
});
module.exports = mongoose.model("User", userSchema);
