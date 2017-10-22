/* jshint esversion:6 */
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');

const db = require('../models');
const User = db.user;

const router = express.Router();

const saltRounds = 12;

/*ROUTES*/
router.route('/login')
  .get((req, res) => {
    return res.render('partials/login');
  })
  .post(passport.authenticate('local', {
    successRedirect : '/gallery',
    failureRedirect : '/error'
  }));

router.route('/logout')
  .get((req, res) => {
    req.logout();
    // on successful logout will redirect to gallery
    res.status(200).redirect('/gallery');
  });

router.route('/register')
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