require('dotenv').config();
require('express-async-errors')

const express = require('express')
const app = express()

const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const productRouter = require('./routes/productRouter')

const authenticate = require('./middleware/authenticate')
const notFoundMiddlware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler')

const morgan  = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const connectDB = require('./db/connect')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('sunrob api');
})

app.get('/api/v1', (req, res) => {
    // console.log(req.cookies)
    console.log(req.signedCookies);
    res.send('sunrob api');
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)

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