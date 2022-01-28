const { use } = require('express/lib/router')
const mongoose = require('mongoose')

const userInfoSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    avatar: {type: String, required: true},
    description: {type: String, required: true},
    country: {type: String, required: true}
})

const UserInfo = mongoose.model('userinfo', userInfoSchema)

module.exports = UserInfo