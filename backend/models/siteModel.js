const mongoose = require("mongoose");

const sitesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please We need the name"],
    maxlength: [40, "site's name must not exceed 40 characters"],
  },
  description: {
    type: String,
    required: [true, "please We need the description"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  lat: { type: String, required: [true, "please provide latitude"] },

  lng: { type: String, required: [true, "please provide longitude"] },
});

const Site = mongoose.model("Site", sitesSchema);
module.exports = Site;
