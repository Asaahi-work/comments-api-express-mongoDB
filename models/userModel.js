const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    avatar: {type: String},
    description: {type: String},
    country: {type: String}
}, {
    timestamps: true,
})

const User = mongoose.model('user', userSchema)

module.exports = User