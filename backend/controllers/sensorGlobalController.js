const SensorGlobal = require("../models/sensorGlobalModel");
const factory = require("../controllers/handlerFactory");

exports.createSensor = factory.createOne(SensorGlobal);
exports.getSensor = factory.getOne(SensorGlobal);
