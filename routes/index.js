const express = require("express");
const homeController = require("../controllers/home_controller");

//a module in express, which helps in seprating app rout and control
const router = express.Router();

console.log("Router is loaded");

router.get('/', homeController.home);
router.use("/users",require("./users") );

// for any further routes access from here
// router.use('/routerName', require("./routerFile"));


module.exports = router;
