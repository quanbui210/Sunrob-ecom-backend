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

ReviewSchema.statics.calculateAvgRating = async function (productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {
            $group: {
                _id: '$product',
                averageRating: {$avg: '$rating'},
                numOfReviews: {$sum: 1}
            },
        }
    ])
    try {
        await this.model('Product').findOneAndUpdate({_id: productId}, {
            averageRating: parseFloat(result[0]?.averageRating.toFixed(1) || 0),
            numOfReviews: Math.ceil(result[0]?.numOfReviews || 0)
        }) //avoid being empty array if no reviews
    } catch (e) {
        console.log(e);
    }
}

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAvgRating(this.product)
})

ReviewSchema.post('remove', async function() {
    await this.constructor.calculateAvgRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)