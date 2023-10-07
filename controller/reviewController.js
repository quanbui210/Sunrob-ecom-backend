const Review = require('../model/Review')
const Product = require('../model/Product')
const {StatusCodes} = require('http-status-codes')
const checkPermissions = require('../utils/checkPermissions')


const getAllReviews = async(req, res) => {
    const allReviews = await Review.find({})
        .populate({path: 'product', select: 'name price'})
        .populate({path: 'user', select: 'name email'})
    res.status(StatusCodes.OK).json(allReviews)
}

const getOneReview = async(req, res) => {
    const {id} = req.params
    const review = await Review.findOne({_id: id}).populate({path: 'product', select: 'name price'})
    .populate({path: 'user', select: 'name email'})
    if (!review) {
        throw new Error('No review found')
    } 
    res.status(StatusCodes.OK).json(review)
}

const createReview = async(req, res) => {
    const review = req.body
    const {product: productId} = req.body
    const validProduct = await Product.findOne({_id: productId})
    if (!validProduct) {
        throw new Error('no product found')
    }
    const alreadyReviewed = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    if (alreadyReviewed) {
        throw new Error ('already reviewed this product')
    }
    req.body.user = req.user.userId
    const newReview = await Review.create(review)
    // validProduct.reviews.push(newReview)
    // const totalReviews = validProduct.reviews.length;
    // const sumRatings = validProduct.reviews.reduce((sum, review) => sum + review.rating, 0);
    // validProduct.averageRating = sumRatings / totalReviews;
    // await validProduct.save()
    res.status(StatusCodes.CREATED).json(newReview)
}

const updateReview = async(req, res) => {
    const {id} = req.params
    const {rating, title, comment} = req.body
    const review = await Review.findOne({_id: id})
    checkPermissions(req.user, review.user)
    review.rating = rating
    review.title = title
    review.comment = comment
    await review.save()
    res.status(StatusCodes.OK).json(review)
}

const deleteReview = async(req, res) => {
    const {id} = req.params
    const review = await Review.findOne({_id: id})
    if(!review) {
        throw new Error('no review to delete') 
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:'delete successfully'})
}
const getSingleProductReviews = async (req, res) => {
    const {id: productId} = req.params
    const reviews = await Review.find({product: productId})
    res.status(StatusCodes.OK).json(reviews)
}

module.exports = {
    getAllReviews,
    getOneReview,
    createReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}