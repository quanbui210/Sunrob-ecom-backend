const { verify } = require("jsonwebtoken")
const jwt = require('jsonwebtoken')

const checkTokenExist = (req, res, next) => {
    // let token = req.signedCookies.token
    // if (!token) {
    //     return res.status(401).json({message: 'No TOKEN'})
    // } 
    // try {
    //     const decoded = verify(token)
    //     req.user = decoded
    //     next()
    // } catch (e) {
    //     return res.status(401).json({message: 'NO TOKEN'})
    // }
}

module.exports = checkTokenExist