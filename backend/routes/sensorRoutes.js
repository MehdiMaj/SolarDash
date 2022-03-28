const express = require("express");
const sensorController = require("./../controllers/sensorController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(sensorController.getSensors)
  .post(sensorController.createSensor);

router
  .route("/my-sensors")
  .get(sensorController.getSensorsByZone, sensorController.getSensors);
router
  .route("/:id")
  .delete(sensorController.deleteSensor)
  .patch(sensorController.getIdSensor, sensorController.updateSensor)
  .get(sensorController.getSensor);

module.exports = router;
