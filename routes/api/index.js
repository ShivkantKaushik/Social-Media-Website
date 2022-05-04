const express = require("express");
const router = express.Router();

// telling browser to use v1
router.use("/v1", require("./v1"));
module.exports = router;