const express = require('express')
const router = express.Router()
const {authenticateUser, authorizePermissions} = require('../middleware/authenticate')
const {
    getAllReviews,
    getOneReview,
    createReview,
    updateReview,
    deleteReview
} = require('../controller/reviewController')


router.route('/').get(getAllReviews).post(authenticateUser, createReview)
router.route('/:id').get(getOneReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)

module.exports = router