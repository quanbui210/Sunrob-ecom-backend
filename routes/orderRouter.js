const express = require('express')
const router = express.Router()

const {authenticateUser, authorizePermissions} = require('../middleware/authenticate')
const {getAllOrders, getOneOrder, getCurrentUserOrders, createOrder, updateOrders} = require('../controller/orderController')

router.route('/').post(authenticateUser, createOrder).get([authenticateUser, authorizePermissions('Admin')], getAllOrders)
router.route('/showOrders').get(authenticateUser,getCurrentUserOrders)
router.route('/:id').get(authenticateUser, getOneOrder).patch(authenticateUser, updateOrders)


module.exports = router
