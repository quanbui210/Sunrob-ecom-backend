const express = require('express')
const router = express.Router()
const checkTokenExist = require('../middleware/checkToken')

const {login, signup, logout, checkToken} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authenticate')


router.post('/login', login)
router.post('/signup', signup)
router.delete('/logout', authenticateUser, logout)
router.get('/checkToken', checkToken, checkTokenExist)


module.exports = router