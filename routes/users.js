const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');

//Alternative User Routes
router.route('/register') // this is an express function
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login') // this is an express function
    .get(users.renderLogin)
    .post(passport
        .authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true }), 
        users.login);
// Normal Ussr Routes
// router.get('/register', users.renderRegister);
// router.post('/register', catchAsync(users.register));
// router.get('/login', users.renderLogin);
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true }), users.login);
router.get('/logout', users.logout);

module.exports = router;