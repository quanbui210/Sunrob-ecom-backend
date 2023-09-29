const express = require('express')
const router = express.Router()
const {createProduct, updateProduct, deleteProduct, getAllProducts, getOneProduct, uploadImage} = require('../controller/productController')
const {authenticateUser, authorizePermissions} = require('../middleware/authenticate')


router.route('/').post([authenticateUser, authorizePermissions('Admin')],createProduct).get(getAllProducts)
router.route('/:id').get(getOneProduct).patch([authenticateUser, authorizePermissions('Admin')],updateProduct).delete([authenticateUser, authorizePermissions('Admin')], deleteProduct)
router.route('/uploadProdImage').post([authenticateUser, authorizePermissions('Admin')], uploadImage)

module.exports = router