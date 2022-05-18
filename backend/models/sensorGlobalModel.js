const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");

const SensorGlobalSchema = mongoose.Schema({
  sensorId: {
    type: String,
    required: [true, "please We need the id"],
    maxlength: [40, "sensors name must not exceed 40 characters"],
    unique: true,
  },
  type: {
    type: String,
    enum: {
      values: ["temperature", "compteur"],
      message: "type is either: temperature, compteur",
    },
    required: [true, "please We need the type"],
  },
  ConsomationTripahse: [],
  PositiveTripahse: [],
  ReverserTipahse: [],
  ActivePowerTipahse: [],
  Voltage_CurrentrTipahse: [],
  Temperature: [],
  Humidite: [],
});
SensorGlobalSchema.methods.checkType = function () {
  return this.type;
};

const SensorGlobal = mongoose.model("SensorGlobal", SensorGlobalSchema);
module.exports = SensorGlobal;
