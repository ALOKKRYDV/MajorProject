const express = require('express');
const router = express.Router();
const { saveRedirectTo } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync');
const userController = require('../controllers/user.js');
const passport = require('passport');

router.get('/signup', userController.renderSignup);

router.post('/signup', wrapAsync(userController.signup));

router.get('/login', userController.renderLogin);

router.post('/login', saveRedirectTo,
     // Use passport to authenticate the user
    passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}),
     wrapAsync(userController.login));

router.get('/logout', userController.logout);
module.exports = router;