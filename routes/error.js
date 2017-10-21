const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    console.log(req.body);
    return res.render('partials/loginReg/wrong_userpw');
  });

module.exports = router;