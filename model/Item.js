const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide item name']
    },
    unique: {
        value: true,
        message: 'product exist'
    },
    status: {
        type: String,
        default: ['available']
    },
    quantity: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
         maxLength: 716
    },
    price: {
        type: Number
    }
})