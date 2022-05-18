const express = require("express");
const sensorController = require("./../controllers/sensorController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//router.use(authController.protect);

router
  .route("/")
  .get(sensorController.getSensors)
  .post(sensorController.getSensorGlobalById, sensorController.createSensor);

router
  .route("/my-sensors")
  .get(sensorController.getSensorsByZone, sensorController.getSensors);
router
  .route("/SensorByZoneAndDate/:zoneId")
  .get(sensorController.getSensorsByZoneOrSiteAndDate);
router
  .route("/SensorBySiteAndDate/:siteId")
  .get(sensorController.getSensorsByZoneOrSiteAndDate);
router
  .route("/:id")
  .delete(sensorController.deleteSensor)
  .patch(sensorController.updateSensor)
  .get(sensorController.getSensor);

module.exports = router;
