const mongoose = require('mongoose')

const checkOutItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})


const checkOutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Checkout', checkOutSchema)
