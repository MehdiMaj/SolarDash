const Zone = require("../models/zoneModel");
const Sensor = require("../models/sensorModel");
const SensorGlobal = require("../models/sensorGlobalModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getSensorGlobalById = catchAsync(async (req, res, next) => {
  const sensor = await SensorGlobal.findOne({ sensorId: req.body.sensorId });
  if (!sensor) {
    return next(new AppError("No sensor found with that ID", 404));
  }
  req.body.sensorId = sensor._id;
  next();
});
exports.setZoneId = (req, res, next) => {
  if (!req.body.zone) req.body.zone = req.params.zoneId;

  next();
};

exports.createSensor = factory.createOne(Sensor);
exports.getSensors = factory.getAll(Sensor);

exports.deleteSensor = factory.deleteOne(Sensor);
exports.updateSensor = factory.updateOne(Sensor);
exports.getSensor = factory.getOne(Sensor, { path: "zone" });

exports.getSensorsByZone = catchAsync(async (req, res, next) => {
  // 1) Find all zones
  const sites = await Zone.find({ user: req.user._id });
  const sitesIDs = sites.map((el) => el._id);
  req.body.zone = sitesIDs;
  next();
});
