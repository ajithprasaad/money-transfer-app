let express = require('express');
let router = express.Router();
let users = require('../collections/users.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ "List all available apis": "Its functions" })
});

router.get('/checkBalance', function (req, res, next) {
  let initialBalance = 0;
  /* Find userId from accountId */
  let currentUser = users.find(user =>
    user.accountId == req.query.id
  )

  /* Calculate his balances from all accounts */
  users.find(user => {
    if (user.userId == currentUser.userId) {
      initialBalance = initialBalance + parseInt(user.accountBalance)
      currentUser.totalBalance = initialBalance
    }
  })

  /* Send out a JSON Response */
  res.json({
    userId: currentUser.userId,
    name: currentUser.name,
    accountBalance: currentUser.totalBalance
  })
});

module.exports = router;
