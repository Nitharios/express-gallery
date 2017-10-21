const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    console.log('error worked');
    return res.render('partials/errors/general_error');
  });

module.exports = router;