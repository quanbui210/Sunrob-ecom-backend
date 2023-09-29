const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'please provide item name'],
        maxLength: [100, 'cannot be >100 characters']
    }, 
    status: {
        type: String,
        default: 'available'
    },
    quantity: {
        type: Number,
        min: 0,
        default: 15
    },
    description: {
        type: String,
         maxLength: 716
    },
    price: {
        type: Number,
        required: [true,'please provide price']
    },
    reviews:{
        type: Array
    },
    category: {
        type: String,
        enum: ['programmable', 'not-programmable', 'education']
    },
    freeShipping: {
        type: Boolean
    },
    averageRating: {
        type: Number,
        default: 0
    },
    image:{
        type: String,
        required: [true, 'please include an image'],
        default: 'product-images/toyabi.jpeg'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featured: {
        type: Boolean
    }
}, {timestamps: true})


module.exports = mongoose.model('Product', ProductSchema)