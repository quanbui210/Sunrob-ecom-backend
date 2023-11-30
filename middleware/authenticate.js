const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {validToken, attachCookies} = require('../utils')
const Token = require('../model/Token')

const authenticateUser = async (req, res, next) => {
    const {accessToken, refreshToken} = req.signedCookies
    try {
        if (accessToken) {
            const payload = validToken(accessToken)
            req.user = {
                name: payload.name,
                userId: payload.userId,
                role: payload.role
            }
            return next()
        }
        const payload = validToken(refreshToken)
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        })
        if (!existingToken) {
            throw new Error('Invalid Credentials')
        }
        attachCookies({ res, user: payload.user, refreshToken: existingToken.refreshToken });
        req.user = payload.user
        next()
    } catch (e) {
        throw new Error('error, unauthenticated')
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