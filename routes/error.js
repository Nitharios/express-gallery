/* jshint esversion:6 */
const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    return res.render('partials/error/404');
  });

module.exports = router;