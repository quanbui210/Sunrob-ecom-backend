const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')

const jwt = require('jsonwebtoken')

const login = async(req, res) => {
    const {name, password} = req.body
    const user = await User.findOne({name}) 
    if (!user) {
        throw new Error('no user found')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        throw new Error('wrong password')
    }
    const token = jwt.sign(
        {
            userId: user._id,
            name: user.name
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )
    res.json({user: {
        name: user.name,
        id: user._id
    }, token})
}

const signup = async(req, res) => {
    const user = await User.create({...req.body}) 
    const token = jwt.sign(
        {
            userId: user._id,
            name: user.name
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )
    res.json({user, token})
}

module.exports = {login, signup}