const express = require('express')
const router = express.Router()
const checkTokenExist = require('../middleware/checkToken')

const {login, signup, logout, checkToken} = require('../controller/authController')


router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.get('/checkToken', checkToken, checkTokenExist)


module.exports = router