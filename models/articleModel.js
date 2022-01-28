const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.ObjectId},
    user: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: Date}
},
{
    timestamps:true
})

const articleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    date: {type: Date, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    text: {type: String, required: true},
    likesCount: {type: Number, required: true},
    comment: [commentSchema]
}, {
    timestamps: true,
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article