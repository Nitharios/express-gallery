/* jshint esversion:6 */
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../models');
const User = db.user;

const router = express.Router();

const saltRounds = 12;

/*ROUTES*/
router.route('/login')
  .get((req, res) => {
    return res.render('partials/login');
  })
  .post('/login', passport.authenticate('local', {
    successRedirect : '/secret',
    failureRedirect : '/'
  }));//end post

router.route('/logout')
  .post((req, res) => {
    req.logout();
    res.sendStatus(200);
    res.redirect('/');
  });

router.route('/register')
  .get((req, res) => {
    return res.render('partials/register');
  })
  .post('/register', (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        db.user.create({
          username : req.body.username,
          password : hash
        })
        .then(user => {
          console.log(user);
          return res.redirect('/');
        })
        .catch(err => { 
          console.log('Error : ', err);
          return res.render('partials/login_error');
        });
      });
    });
  });

module.exports = router;