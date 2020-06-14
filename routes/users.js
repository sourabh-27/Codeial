const express = require('express');
// console.log("I am inside users route");
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.udpate);


router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);


router.post('/create', usersController.create);


// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

module.exports = router;