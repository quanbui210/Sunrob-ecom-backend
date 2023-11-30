const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')
const crypto = require('crypto')
const Token = require('../model/Token')

const jwt = require('jsonwebtoken')
const {createJWT, validToken, attachCookies, createTokenUser} = require('../utils')

const login = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new Error('Please provide email and password')
    }
    const user = await User.findOne({email}) 
    if (!user) {
        throw new Error('no user found')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        throw new Error('wrong password')
    }
    const tokenUser = createTokenUser(user)
    console.log(tokenUser);
    let refreshToken = ''
    const existingToken = await Token.findOne({user: user._id})
    if (existingToken) {
        const {isValid} = existingToken
        if (!isValid) {
          throw new Error('Verify your email')
        }
        refreshToken = existingToken.refreshToken
        attachCookies({res, user: tokenUser, refreshToken})
        res.status(200).json({user: tokenUser})
        return
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken, ip, userAgent, user: user._id}
    await Token.create(userToken)
    attachCookies({ res, user: tokenUser, refreshToken})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const signup = async(req, res) => {
    const {email, name, password} = req.body
    const existingUser = await User.findOne({email})
    if (existingUser) {
        throw new Error('Email already existed')
    }

    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount ? 'Admin' : 'User'

    const user = await User.create({
        name, email, password, role
    }) 
    const tokenUser = createTokenUser(user)
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const logout = async (req, res) => {
    await Token.findOneAndDelete({user: req.user.userId})
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expries: new Date(Date.now() + 10 * 1000) 
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expries: new Date(Date.now() + 10 * 1000) 
    })
    res.status(StatusCodes.OK).json({msg: 'logged out successfully'})

}

const checkToken = async (req, res) => {
    const {accessToken, refreshToken} = req.signedCookies
    if ((!accessToken || accessToken === 'logout') && (!refreshToken || refreshToken === 'logout')) {
        res.status(StatusCodes.OK).json({message: 'No TOKEN', authenticated: false})
    } else {
        res.status(StatusCodes.OK).json({message: 'Authenticated', token: accessToken, authenticated: true})
    }
}

module.exports = {login, signup, logout, checkToken}