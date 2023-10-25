const Product = require('../model/Product')
const {StatusCodes} = require('http-status-codes')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')
const { log } = require('console')
const createProduct = async(req, res) => {
    req.body.user = req.user.userId
    const newProduct = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({newProduct})
}

const updateProduct = async(req, res) => {
    const updatedProduct = req.body
    const {id} = req.params
    const product = await Product.findOneAndUpdate(
        {_id: id}, 
        updatedProduct, 
        {new: true, runValidators: true})
    console.log(product);
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async(req, res) => {
    const {id} = req.params
    const productToDelete = await Product.findOne({_id: id})
    if (!productToDelete) {
        throw new Error('no product found to delete')
    }
    await productToDelete.remove()
    res.status(StatusCodes.OK).json({msg: 'delete successfully', productToDelete})
}

const getAllProducts = async(req, res) => {
    const products = await Product.find({}).populate('reviews')
    res.status(StatusCodes.OK).json({products})
}

const getOneProduct = async(req, res) => {
    const {id} = req.params
    const product = await Product.findOne({_id: id}).populate('reviews')
    if (!product) {
        throw new Error('no product found')
    }
    res.status(StatusCodes.OK).json({product})
}

const uploadImageLocal = async(req, res) => {
    if (!req.files) {
        throw new Error('please provide images')
    }
    const productImg = req.files.image
    console.log(productImg);
    if (!productImg.mimetype.startsWith('image')) {
        throw new Error('Please upload correct image file type')
    }
    const maxSize = 1024 * 1024
    if(productImg.size > maxSize) {
        throw new Error('File size too big')
    }
    const imgPath = path.join(__dirname, '../public/product-images/' + `${productImg.name}`)
    await productImg.mv(imgPath)
    res.status(StatusCodes.OK).json({image: `/product-images/${productImg.name}`})
}
const uploadImage = async (req, res) => {
    console.log(req.files)
    const productImg = req.files.image.tempFilePath
    let result = await cloudinary.uploader.upload(productImg,{
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'Sunrob'
    })
    fs.unlinkSync(productImg)
    return res.status(StatusCodes.OK).json({img: {src: result.secure_url}})
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getOneProduct,
    uploadImage
}