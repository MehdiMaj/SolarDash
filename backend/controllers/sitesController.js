const Site = require("../models/siteModel");
const Zone = require("../models/zoneModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createSite = factory.createOne(Site);
exports.getSites = factory.getAll(Site);
exports.deleteSite = factory.deleteOne(Site);
exports.updateSite = factory.updateOne(Site);
exports.getSite = factory.getOne(Site, { path: "zones" });

exports.deleteZoneWithSite = catchAsync(async (req, res, next) => {
  await Zone.deleteMany({ site: req.params.id });
  next();
});
