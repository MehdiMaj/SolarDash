const Site = require("../models/siteModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.createSite = catchAsync(async (req, res, next) => {
  userId = req.user._id;

  const site = new Site({
    name: req.body.name,
    description: req.body.description,
    user: userId,
  });
  const doc = await Site.create(site);
  res.status(204).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getSites = factory.getAll(Site);
exports.deleteSite = factory.deleteOne(Site);
exports.updateSite = factory.updateOne(Site);
exports.getSite = factory.getOne(Site);
