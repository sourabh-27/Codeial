const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log("Router loaded");

router.get('/', homeController.home);
router.use('/user', require('./users'));

// for any other router
//router.use('/routerName', require('./routerFile'));

module.exports = router;