const mongoose = require("mongoose");

const SensorSchema = mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.ObjectId,
    ref: "SensorGlobal",
    required: [true, "please We need the id"],
    unique: true,
  },
  zone: {
    type: mongoose.Schema.ObjectId,
    ref: "Zone",
  },
});

const Sensor = mongoose.model("Sensor", SensorSchema);
module.exports = Sensor;
