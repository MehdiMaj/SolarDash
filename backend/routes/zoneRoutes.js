const express = require("express");
const zonesController = require("./../controllers/zoneController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(zonesController.getZones)
  .post(zonesController.setSiteId, zonesController.createZone);

router
  .route("/:id")
  .delete(zonesController.deleteZone)
  .patch(zonesController.updateZone)
  .get(zonesController.getZone);

module.exports = router;
