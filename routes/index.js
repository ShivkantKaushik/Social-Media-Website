const express = require("express");
const homeController = require("../controllers/home_controllers");

//a module in express, which helps in seprating app rout and control
const router = express.Router();

console.log("Router is loaded");

router.get('/', homeController.home);

module.exports = router;