/* jshint esversion:6 */
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

const db = require('../models');

const saltRounds = 12;

router.route('/')
  .get((req, res) => {
  return res.render('partials/register');
})
  .post((req, res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        db.user.create({
          username : req.body.username,
          password : hash
        })
        .then(user => {
          console.log(user);
          res.redirect('/');
        })
        .catch(err => { return res.send('stupid username'); });
      });
    });
  });

module.exports = router;