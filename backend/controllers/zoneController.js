const Zone = require("../models/zoneModel");
const factory = require("../controllers/handlerFactory");

exports.setSiteId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.site) req.body.site = req.params.siteId;

  next();
};

exports.createZone = factory.createOne(Zone);
exports.getZones = factory.getAll(Zone);
exports.deleteZone = factory.deleteOne(Zone);
exports.updateZone = factory.updateOne(Zone);
exports.getZone = factory.getOne(Zone);
