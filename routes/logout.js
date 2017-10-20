/* jshint esversion:6 */
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    req.logout();
    res.sendStatus(200);
  });

module.exports = router;