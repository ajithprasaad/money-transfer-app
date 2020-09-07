const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: String
    },
    accountId: {
        type: String
    },
    name: {
        type: String
    },
    accountType: {
        type: String
    },
    accountBalance: {
        type: Number
    }
})

module.exports = mongoose.model('User', userSchema)