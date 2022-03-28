const mongoose = require("mongoose");

const SensorSchema = mongoose.Schema({
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
  zone: {
    type: mongoose.Schema.ObjectId,
    ref: "Zone",
  },
});

const Sensor = mongoose.model("Sensor", SensorSchema);
module.exports = Sensor;
