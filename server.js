//imports
const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/arcticleRoutes')
const userRouter = require('./routes/userRoutes')
const cors = require('cors')

//config
const app = express()
const port = 5000

app.use(express.json({extended: true}))
app.use(cors())

const connectionUrl = 'mongodb://localhost/forumdb'
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  

//routes
app.get('/', (req, res) => {
    return res.status(200).send('Server is working.')
})

app.use('/api/users/', userRouter)
app.use('/api/articles/', articleRouter)

//middlewares
app.use((err, req, res, next) => {
    res.status(500).send({message: err.message})
})

//listener
app.listen(port, () => console.log(`Server has been started on port ${port}...`))