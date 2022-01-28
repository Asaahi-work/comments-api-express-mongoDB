const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const Article = require('../models/articleModel.js')
const { isAuth, isAdmin } = require('../utils')
const articleRouter = express.Router()
const mongoose = require('mongoose')

//get all articles
articleRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    const data = await Article.find({})
    .populate('user', 'user.name ')

    if (data) {
        return res.status(200).send(data)
    } else {
        return res.status(404).send("no data found.")
    }
}))

//get article by id 
articleRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    const data = await Article.findById(id).populate('user', 'user.name')

    if (data) {
        return res.status(200).send(data)
    } else {
        return res.status(404).send("no data found.")
    }
}))

//create article
articleRouter.post('/new', isAuth, expressAsyncHandler(async (req, res) => {
    const {title, category} = req.body

    if(title.length > 200) {
        res.status(401).send({message: 'max 200chrs.'})
    }

    if(category.length > 100) {
        res.status(401).send({message: 'max 200chrs.'})
    }

    const article = new Article({
        title: req.body.title,
        category: req.body.category,
        user: req.user._id,
        date: req.body.date,
        text: req.body.text,
        likesCount: req.body.likesCount
    })

    const createdArticle = await article.save()

    res.status(201).send({
       article: createdArticle
    })
}))

//update article
articleRouter.put('/update/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id)

    if(article) {
        article.title = req.body.title,
        article.category = req.body.category,
        article.text = req.body.text

        const updatedArticle = await article.save()
        res.send({message: 'Article has been updated.', article: updatedArticle})
    } else {
        res.status(404).send({message: 'Article not found.'})
    }
}))

//delete article
articleRouter.delete('/delete/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id)

    if(article) {
        const deletedArticle = await article.remove()
        res.send({message: 'Article has been deleted', article: deletedArticle})
    } else {
        res.status(404).send({message: 'Article not found.'})
    }

}))

//new comment
articleRouter.post('/comment/new/:id', isAuth, expressAsyncHandler( async (req, res) => {
    const articleId = req.params.id
    const article = await Article.findById(articleId)

    if(article) {
        const comment = {
            user: req.user.name,
            text: req.body.text,
            date: Date.now()
        }

        article.comment.push(comment)
        const createdComment = await article.save()

        res.status(201).send({
            message: 'Comment has been added.',
            comment: createdComment.comment[createdComment.comment.length - 1],
        })

    } else {
        res.status(404).send({message: "article Not Found."})
    }
}))

//edit comment // TO-DO: решить вопрос с этой хуйнёй.
articleRouter.put('/:id/comment/edit/:commentId', expressAsyncHandler( async (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentId
    const article = await Article.findById(id)
    const comment = await article.comment.find(commentId)

    if(article) {
        if(comment) {
            comment.name = req.user.name,
            comment.text = req.body.text,
            comment.date = Date.now()

            article.comment.push(comment)
            const updatedComment = await article.save()

            res.status(201).send({
                message: 'Comment has been edited.',
                comment: updatedComment.comment[updatedComment.comment.length - 1],
            })
        }
    } else {
        res.status(404).send({message: "Article Not Found."})
    }
}))

//delete article by admin
articleRouter.delete('/admin/delete/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id)

    if(article) {
        const deletedArticle = await article.remove()
        res.send({message: 'Article has been deleted', article: deletedArticle})
    } else {
        res.status(404).send({message: 'Article not found.'})
    }

}))

module.exports = articleRouter