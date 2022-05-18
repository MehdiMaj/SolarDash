const express = require("express");
const consumer = require("./../shared/consumer");
const authController = require("../controllers/authController");

const router = express.Router();

//router.use(authController.protect);

router.route("/:id").get(consumer.consume);
module.exports = router;
