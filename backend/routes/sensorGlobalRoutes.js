const express = require("express");
const sensorGlobalController = require("./../controllers/sensorGlobalController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").post(sensorGlobalController.createSensor);
//.get(sensorGlobalController.getSensors)
/*router
  .route("/:id")
  .delete(sensorGlobalController.deleteSensor)
  .patch(sensorGlobalController.getIdSensor, sensorController.updateSensor)
  .get(sensorGlobalController.getSensor);*/

module.exports = router;
