/* jshint esversion:6 */
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    return res.render('partials/login');
  })
  .post(passport.authenticate('local', {
    successRedirect : '/secret',
    failureRedirect : '/'
  }));

module.exports = router;