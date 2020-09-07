let express = require('express');
let router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')

/* MONEY TRANSFER API */
router.get('/moneytransfer', async function (req, res, next) {
  /* Find userId from accountId */
  const from = parseInt(req.query.from)
  const to = parseInt(req.query.to)
  const amount = parseInt(req.query.amount)

  const fromUser = await User.findOne({ "accountId": from })
  const toUser = await User.findOne({ "accountId": to })

  /* Basic Error Handling */
  if ((fromUser == null || fromUser == undefined) || (toUser == null || toUser == undefined)) {
    res.status(400).json({
      message: "could not find any existing user ",
      err: "unknown user exception"
    })
  } else if (fromUser.userId == toUser.userId || amount == null || amount == undefined) {
    res.status(400).json({
      message: "transfer initiated between same users or invalid amount entered",
      err: "money transfer exception"
    })
    /* allow transfer now */
  } else if (toUser.accountType == "Basic Savings") {
    if (toUser.accountBalance + amount > 50000) {
      res.status(400).json({
        message: "Exceeding the limit of transfer to account type",
        err: "money transfer exception"
      })
    } else {
      req.creditor = fromUser;
      req.debtor = toUser;
      req.amount = amount;
      return next()
    }
    /* allow transfer now */
  } else {
    req.creditor = fromUser;
    req.debtor = toUser;
    req.amount = amount;
    next()
  }
}, async function (req, res, next) {
  /* Check sufficient balance for transfer AND Value of tcreditorransfer */
  const creditor = req.creditor;
  const debtor = req.debtor;
  const amount = parseInt(req.query.amount)
  if (creditor.accountBalance >= amount) {

    /* Make money transfer with async await*/
    creditor.accountBalance = parseInt(creditor.accountBalance) - amount
    debtor.accountBalance = parseInt(debtor.accountBalance) + amount

    /* Update to database */
    await User.findOneAndUpdate({ 'accountId': creditor.accountId }, creditor, {}).exec()
    await User.findOneAndUpdate({ 'accountId': debtor.accountId }, debtor, {}).exec()

    res.status(200).json({
      creditor_balance: creditor.accountBalance,
      debtor_balance: debtor.accountBalance,
      message: "Congratulations! Amount was successfully transfered",
      err: 'None'
    })
  }
  else {
    res.status(400).json({
      message: "Insufficient balance",
      err: "money transfer exception"
    })
  }
});

/* CHECK BALANCE API */
router.get('/checkBalance', async function (req, res, next) {
  /* Find userId from accountId */
  const id = parseInt(req.query.id)
  req.user = await User.findOne({ "accountId": id })
  next()
}, async function (req, res, next) {
  let initialBalance = 0;
  let currentUser = req.user;
  if (currentUser == null || currentUser == undefined) {
    res.status(400).json({
      message: "could not find any existing user",
      err: "Unknown user exception"
    })
  } else {
    /* Calculate his balances from all accounts */
    const users = await User.find({ "userId": currentUser.userId }, function (err, users) {
      if (err) {
        res.status(400).json({
          message: "something went wrong while fetching users list",
          err: "sql exception"
        })
      }
      return users;
    });

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
      accountBalance: currentUser.accountBalance,
      totalBalance: currentUser.totalBalance,
      message: `Hi ${currentUser.name}, your total available balance is ${currentUser.totalBalance}`
    })
  }
});

module.exports = router;
