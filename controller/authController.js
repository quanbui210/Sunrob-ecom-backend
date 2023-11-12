const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')


const jwt = require('jsonwebtoken')
const {createJWT, validToken, attachCookies, createTokenUser} = require('../utils')

const login = async(req, res) => {
    const {email, name, password} = req.body
    const user = await User.findOne({email}) 
    if (!user) {
        throw new Error('no user found')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        throw new Error('wrong password')
    }
    const tokenUser = createTokenUser(user)
    attachCookies({req, res, user: tokenUser})
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
    attachCookies({req, res, user: tokenUser})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expries: new Date(Date.now() + 10 * 1000) 
    })
    res.status(StatusCodes.OK).json({msg: 'logged out successfully'})
}

// const checkToken = async (req, res) => {
//     const token = req.signedCookies.token
//     if (token || token !== 'logout') {
//         res.status(StatusCodes.OK).json({token, authenticated: true})
//     }
// }

const checkToken = async (req, res) => {
    const token = req.signedCookies.token
    if (!token || token === 'logout') {
        res.status(StatusCodes.OK).json({message: 'No TOKEN', authenticated: false})
    } else {
        res.status(StatusCodes.OK).json({message: 'Authenticated', token, authenticated: true})
    }
}

module.exports = {login, signup, logout, checkToken}