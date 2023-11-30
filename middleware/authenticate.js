const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {validToken, attachCookies} = require('../utils')

const authenticateUser = async (req, res, next) => {
    const {accessToken, refreshToken} = req.signedCookies
    try {
        if (accessToken) {
            const payload = validToken(accessToken)
            console.log(payload);
            req.user = payload.user
            // req.user = {
            //     name: payload.name,
            //     userId: payload.userId,
            //     role: payload.role
            // }
            return next()
        }
        const payload = validToken(refreshToken)
        console.log(payload);
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.user.refreshToken
        })
        if (!existingToken || !existingToken.isValid) {
            throw new Error('Invalid Credentials')
        }
        attachCookies({res, user: existingToken.user, refreshToken: existingToken.refreshToken})
        req.user = payload.user
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