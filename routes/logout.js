/* jshint esversion:6 */
// handles logout
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    req.logout();
    // on successful logout will redirect to gallery
    res.status(200).redirect('/gallery');
  });

module.exports = router;