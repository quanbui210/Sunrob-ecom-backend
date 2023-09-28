const express = require('express')
const router = express.Router()
const {authenticateUser, authorizePermissions} = require('../middleware/authenticate')
const {
    getAllUsers, getOneUser, showCurrentUser,
    updateUser, updateUserPassword, deleteUser
} = require('../controller/userController')


//auth user first, then admin

router.route('/').get(authenticateUser, authorizePermissions('Admin'), getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser) //before:id, does not query db, just get from cookies
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser,getOneUser)


module.exports = router