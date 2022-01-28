const jwt = require("jsonwebtoken")
const User = require("./models/userModel")

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin
        },
        'secret',
        {
            expiresIn: '30d'
        }
    )
}

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization

    if(authorization) {
        const token = authorization.slice(7, authorization.length)
        jwt.verify(
            token,
            'secret',
            (err, decode) => {
                if(err) {
                    res.status(401).send({message: 'Invalid token'})
                } else {
                    req.user = decode
                    next()
                }
            }
        )
    } else {
        res.status(401).send({message: 'No Token'})
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next()
    } else {
        res.status(403).send('no roots')
    }
}

exports.generateToken = generateToken
exports.isAuth = isAuth
exports.isAdmin = isAdmin