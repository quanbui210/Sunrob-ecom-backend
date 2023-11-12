const Order = require('../model/Order')
const Product = require('../model/Product')
const {StatusCodes} = require('http-status-codes')
const {checkPermissions} = require('../utils')

const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = 'someRandomeValue'
    return {client_secret, amount}
}

const getAllOrders = async (req, res) => {
    console.log('all orders');
    const allOrders = await Order.find({}).populate({path: 'user', select: 'name email role'})
    res.status(StatusCodes.OK).json(allOrders)
}
const getOneOrder = async (req, res) => {
    const {id: orderId} = req.params
    const order = await Order.findOne({_id: orderId})
    if (!order) {
        throw new Error('No order found')
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json(order)
}
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user.userId})
    res.status(StatusCodes.OK).json(orders)
}
const createOrder = async (req, res) => {
    const {items: cartItems, tax, shippingFee} = req.body
    if (!cartItems || cartItems.length < 1) {
        throw new Error ('no items provided')
    }
    if (!tax || !shippingFee) {
        throw new Error ('tax and shipping fee needed')
    }
    let orderItems = []
    let subtotal = 0
    for (let item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.id})
        if (!dbProduct) {
            throw new Error(`No product found`)
        }
        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            quantity: item.quantity,
            name,
            price,
            image,
            id:_id
        }
        orderItems = [...orderItems, singleOrderItem]
        subtotal += item.quantity * price
    }
    //calculate total
    const total = tax + shippingFee + subtotal
    //get clientSecret
    const paymentIntent = await fakeStripeAPI({ 
        amount: total, currency: 'usd'
    })
    const order = await Order.create({
        orderItems, 
        total, 
        subtotal, 
        tax, 
        shippingFee, 
        clientSecret: paymentIntent.client_secret, 
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
}
const updateOrders = async (req, res) => {
    const {id: orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id: orderId})
    if (!order) {
        throw new Error('No order found')
    }
    checkPermissions(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json(order)
}
module.exports = {
    getAllOrders, getOneOrder, getCurrentUserOrders, createOrder, updateOrders
}