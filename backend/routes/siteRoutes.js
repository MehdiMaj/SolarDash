const express = require("express");
const sitesController = require("./../controllers/sitesController");
const authController = require("../controllers/authController");
const zoneRouter = require("../routes/zoneRoutes");
const router = express.Router();

router.use("/:siteId/zones", zoneRouter);

router.use(authController.protect);

router
  .route("/")
  .post(sitesController.createSite)
  .get(sitesController.getSites);
router
  .route("/:id")
  .delete(sitesController.deleteSite)
  .patch(sitesController.updateSite)
  .get(sitesController.getSite);

module.exports = router;
