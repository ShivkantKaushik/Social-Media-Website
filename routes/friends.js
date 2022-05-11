const express = require("express");
const router = express.Router();

const friendsController = require("../controllers/friends_controller");

router.post("/create", friendsController.create);
router.post("/destroy", friendsController.destroy);

module.exports = router;