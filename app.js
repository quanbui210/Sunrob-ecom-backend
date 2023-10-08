require('dotenv').config();
require('express-async-errors')

const express = require('express')
const app = express()

const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const productRouter = require('./routes/productRouter')
const reviewRouter = require('./routes/reviewRouter')
const orderRouter = require('./routes/orderRouter')

const authenticate = require('./middleware/authenticate')
const notFoundMiddlware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler')

const morgan  = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const fileUpload = require('express-fileupload')

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  })

const connectDB = require('./db/connect')

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}))
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload({useTempFiles: true}))




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
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddlware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5002

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