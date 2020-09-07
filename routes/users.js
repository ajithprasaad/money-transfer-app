var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')

/* GET users listing. */
router.get(['/', '/users'], async function (req, res, next) {
  await User.find({}, function (err, users) {
    if (err) {
      res.status(400).json({
        message: "something went wrong while fetching users list",
        err: "sql exception"
      })
    } else {
      res.status(200).json({
        users
      })
    }
  });
});

module.exports = router;
