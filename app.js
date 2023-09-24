require('dotenv').config();
require('express-async-errors')

const express = require('express')
const app = express()

const authRouter = require('./routes/authRouter')
const authenticate = require('./middleware/authenticate')
const notFoundMiddlware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler')
const morgan  = require('morgan')

const connectDB = require('./db/connect')

app.use(morgan('tiny'))
app.use(express.json())


app.get('/', (req, res) => {
    res.send('sunrob api');
})
app.use('/api/v1/auth', authRouter)

app.use(notFoundMiddlware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`listenning on port ${port}`)
        }
        )
    } catch (e){
        console.log(e)
    }
}

start()