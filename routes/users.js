const express = require("express");
const router = express.Router();
const passport = require('passport');

const usersController = require("../controllers/users_controller");

//used passport.checkAuthentication as middleware, means usersController.profile will be accessible when
// success, means when user is signed in
router.get("/profile/:id",passport.checkAuthentication, usersController.profile);
router.post("/update/:id",passport.checkAuthentication, usersController.update);

router.get("/sign-up", usersController.signup);
router.get("/sign-in", usersController.signin); 

router.post("/create", usersController.create);


// use passport as a middelware to authenticate
// if middleware authentication is successfull, then only third parameter 
// usersController.createSession will execute
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);


router.get("/sign-out", usersController.destroySession);
module.exports = router;