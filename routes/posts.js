const express = require("express");
const router = express.Router();
const passport = require("passport");

const postsController = require("../controllers/posts_controller");

// but we need one check on controller level also, otherwise anybody can go to develoer tools,
// can create a form without login, there with input name as content and can post it , use can 
// see action also, once signed in , and then they can post anonymously , so to prevent it we would
//  need once check at controller level also
router.post("/create", passport.checkAuthentication, postsController.create);
router.get("/destroy/:id", passport.checkAuthentication, postsController.destroy);

module.exports = router;