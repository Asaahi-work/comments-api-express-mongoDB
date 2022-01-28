const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const { generateToken, isAuth, isAdmin } = require('../utils.js')
const UserInfo = require('../models/userInfoModel.js')

//get users
userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    const data = await User.find({})
    res.status(200).send(data)
}))

//get user by id
userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    const data = await User.findById(id)
    res.status(200).send(data)

}))

//get userInfo
userRouter.get('/seed/info', expressAsyncHandler(async (req, res) => {
    const data = await UserInfo.find({}).populate('user')
    res.status(200).send(data)
}))

//get userInfo by id
userRouter.get('/seed/info/:id', expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    const data = await UserInfo.findById(id).populate('user')
    res.status(200).send(data)
}))

//register
userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const existingUser = await User.findOne({email: req.body.email})

    if(existingUser) {
        res.status(401).send({message: 'This email already exists.'})
    }

    if(req.body.password.length < 8) {
        res.status(401).send({message: 'min 8chrs.'})
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password), 
        isAdmin: req.body.isAdmin,
        avatar: "",
        description: "",
        country: "",
    })

    const createdUser = await user.save()

    res.status(201).send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
        isAdmin: createdUser.isAdmin,
        avatar: createdUser.avatar,
        description: createdUser.description,
        country: createdUser.country,
        token: generateToken(createdUser),
    })

}))

//login
userRouter.post('/login', expressAsyncHandler(async (req, res) => {
    const existingUser = await User.findOne({email: req.body.email})

    if(existingUser) {
            if (bcrypt.compareSync(req.body.password, existingUser.password)) {
                res.status(200).send({
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                    avatar: existingUser.avatar,
                    description: existingUser.description,
                    country: existingUser.country,
                    token: generateToken(existingUser)
                })
                return
            }
    }
    res.status(401).send({message: 'Invalid email or password.'})
}))

//update user info
userRouter.put('/edit/profile/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)

    try {

        if (user) {
            const {name, avatar, description, country} = req.body

            user.name = name
            user.avatar = avatar
            user.description = description
            user.country = country
    
            const updatedUserInfo = await user.save()

            res.send({message: "User info has been updated :)", updatedUser: updatedUserInfo})
        } else {
            return res.status(404).send({message:"User Not Found."})
        }

    } catch (err) {
        return res.status(401).send("unauthorizated.")
    }
}))

//delete user by admin
userRouter.delete('/admin/delete/:id', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)

    try {
        
        if (user) {
            const deletedUser = await User.remove(user)
            res.send({message: "User has been deleted."})
        } else {
            return res.status(404).send({message: "User Not Found."})
        }
    } catch (err) {
        return res.status(401).send("unauthorizated.")
    }
}))

module.exports = userRouter
