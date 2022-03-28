const Zone = require("../models/zoneModel");
const Site = require("../models/siteModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.setSiteId = (req, res, next) => {
  if (!req.body.site) req.body.site = req.params.siteId;

  next();
};

exports.createZone = factory.createOne(Zone);
exports.getZones = factory.getAll(Zone);

exports.deleteZone = factory.deleteOne(Zone);
exports.updateZone = factory.updateOne(Zone);
exports.getZone = factory.getOne(Zone, { path: "site" });

exports.getZonesByUser = catchAsync(async (req, res, next) => {
  // 1) Find all sites
  const sites = await Site.find({ user: req.user._id });
  const siteIDs = sites.map((el) => el._id);
  req.body.site = siteIDs;
  next();
});
