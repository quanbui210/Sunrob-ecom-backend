const express = require('express')
const router = express.Router()
const {createProduct, updateProduct, deleteProduct, getAllProducts, getOneProduct, uploadImage} = require('../controller/productController')
const {authenticateUser, authorizePermissions} = require('../middleware/authenticate')
const {getSingleProductReviews} = require('../controller/reviewController')

router.route('/').post([authenticateUser, authorizePermissions('Admin')],createProduct).get(getAllProducts)
router.route('/uploadProdImage').post([authenticateUser, authorizePermissions('Admin')], uploadImage)
router.route('/:id').get(getOneProduct).patch([authenticateUser, authorizePermissions('Admin')],updateProduct).delete([authenticateUser, authorizePermissions('Admin')], deleteProduct)
router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router