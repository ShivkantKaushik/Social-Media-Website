const express = require("express");
const homeController = require("../controllers/home_controller");
const usersController = require("../controllers/users_controller");
//a module in express, which helps in seprating app rout and control
const router = express.Router();

console.log("Router is loaded");

router.get('/', homeController.home);
router.use("/users",require("./users") );

// for any further routes access from here
// router.use('/routerName', require("./routerFile"));


router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));

router.use('/api', require('./api'));

router.get('/reset-password/:id', usersController.updatePassword);
router.post('/reset-password/:id', usersController.postReqToUpdatePassword);


router.use('/likes', require('./likes'));

module.exports = router;
