const mongoose = require("mongoose");

const zonesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please We need the name"],
    maxlength: [40, "site's name must not exceed 40 characters"],
  },

  site: {
    type: mongoose.Schema.ObjectId,
    ref: "Site",
    required: true,
  },
  createdAt: Date,
});

zonesSchema.pre("save", async function (next) {
  this.createdAt = Date.now() - 1000;
  next();
});

const Zone = mongoose.model("Zone", zonesSchema);
module.exports = Zone;
