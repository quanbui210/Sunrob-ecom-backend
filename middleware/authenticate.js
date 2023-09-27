const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {validToken} = require('../utils')
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new Error('Invalid credentials')
    }
    try {
        const payload = validToken({token})
        console.log(payload)
        req.user = {
            name: payload.name,
            userId: payload.userId,
            role: payload.role
        }
        console.log(payload);
        next()
    } catch (e) {
        throw new Error('error')
    }
   
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new Error('Unauthorized')
        }
        next()
    }
}

module.exports = {authenticateUser, authorizePermissions}