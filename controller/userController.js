exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name })
    const register = promisify(User.register, User)
    await register(user, req.body.password)
    next()

    /* Calculate his balances from all accounts */
    users.find(user => {
        if (user.userId == currentUser.userId) {
            initialBalance = initialBalance + parseInt(user.accountBalance)
            currentUser.totalBalance = initialBalance
        }
    })
}