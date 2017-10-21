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
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        let username = req.body.username;
        db.user.create({
          username : username,
          password : hash
        })
        .then(user => {
          return res.redirect('/');
        })
        .catch(err => { 
          return res.render('partials/loginReg/user_already_exists');
        });
      });
    });
  });

module.exports = router;