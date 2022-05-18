const express = require("express");
const zoneController = require("./../controllers/zoneController");
const authController = require("../controllers/authController");
const sensorRouter = require("../routes/sensorRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:zoneId/sensors", sensorRouter);

router.use(authController.protect);

router
  .route("/")
  .get(zoneController.getZones)
  .post(zoneController.setSiteId, zoneController.createZone);

router
  .route("/my-zones")
  .get(zoneController.getZonesByUser, zoneController.getZones);
router
  .route("/:id")
  .delete(zoneController.deleteZone)
  .patch(zoneController.updateZone)
  .get(zoneController.getZone);

module.exports = router;
