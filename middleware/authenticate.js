const User = require('../model/User')
const jwt = require('jsonwebtoken')
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if (!authHeader || authHeader.startsWith('Bearer')){
        throw new Error('Unauthorized')
    }
    const token = authHeader.split(' ')[1]
    try {
       const payload = jwt.verify(token, process.env.JWT_SECRET)
       req.user = {userId: payload.userId, name: payload.name}
    } catch (e) {
        throw new Error('Unauthorized')
    }
}

module.exports = authenticate