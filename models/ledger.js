const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ledgerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  folio: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  credit: {
    type: Number,
    required: true,
  },
  debit: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Ledger", ledgerSchema);
