const express = require('express');
// console.log("I am inside users route");
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);

module.exports = router;