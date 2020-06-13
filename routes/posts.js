const express = require('express');
const router = express.Router();
const passport = require('passport');

const PostsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication ,PostsController.create);

module.exports = router;