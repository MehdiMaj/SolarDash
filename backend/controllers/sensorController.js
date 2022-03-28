const Zone = require("../models/zoneModel");
const Sensor = require("../models/sensorModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.setZoneId = (req, res, next) => {
  if (!req.body.zone) req.body.zone = req.params.zoneId;

  next();
};
exports.getIdSensor = catchAsync(async (req, res, next) => {
  const sensor = await Sensor.findOne({ sensorId: req.params.id });
  req.params.id = sensor._id;
  next();
});
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
