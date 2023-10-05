const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    comment: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref:'Product',
        required: true
    }
}, {timestamps: true})

ReviewSchema.index({product: 1, user:1}, {unique: true})

module.exports = mongoose.model('Review', ReviewSchema)