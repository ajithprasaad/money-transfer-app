let express = require('express');
let router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ "List all available apis": "Its functions" })
});

router.get('/moneytransfer', async function (req, res, next) {
  /* Find userId from accountId */
  const fromUser = await User.findOne({ "accountId": "123" })
  const toUser = await User.findOne({ "accountId": "200" })
  req.query.amount = 100000
  const amount = req.query.amount
  /* Basic Error Handling */
  if ((fromUser == null || fromUser == undefined) || (toUser == null || toUser == undefined)) {
    res.status(400).json({
      message: "could not find any existing user ",
      err: "unknown user exception"
    })
  } else if (fromUser.userId == toUser.userId || parseInt(amount == null) || parseInt(amount == undefined)) {
    /* amount limit handled below */
    res.status(400).json({
      message: "transfer initiated between same users or invalid amount entered",
      err: "money transfer exception"
    })
    /* allow transfer now */
  } else {
    req.creditor = fromUser;
    req.debtor = toUser;
    next()
  }
}, async function (req, res, next) {
  const creditor = req.creditor;
  const debtor = req.debtor;
  const amount = parseInt(req.query.amount)

  /* Check sufficient balance for transfer OR Value of transfer */
  if (creditor.accountBalance >= 1000 && amount < 50000) {

    /* Make money transfer with async await*/
    creditor.accountBalance = parseInt(creditor.accountBalance) - amount
    debtor.accountBalance = parseInt(debtor.accountBalance) + amount

    /* Update to database */

    res.status(200).json({
      message: "Congratulations! Amount was successfully transfered",
      err: 'None'
    })
  } else {
    res.status(400).json({
      message: "Insufficient balance or amount entered is greater than allowed limit",
      err: "money transfer exception"
    })
  }
});

router.get('/checkBalance', function (req, res, next) {
  /* Find userId from accountId */
  req.currentUser = users.find(user =>
    user.accountId == req.query.id
  )
  next()
}, function (req, res, next) {
  let initialBalance = 0;
  let currentUser = req.currentUser;
  if (currentUser == null || currentUser == undefined) {
    res.status(400).json({
      message: "could not find any existing user",
      err: "Unknown user exception"
    })
  } else {
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
  }
});

module.exports = router;
