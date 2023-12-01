const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Order = require('../model/Order')



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'not a valid email'
        },
        unique: {
            value: true,
            message: 'email existed'
        },
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 5
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'Order'
    }],
    verificationToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Date
    },
    passwordToken: {
        type: String
    },
    passwordTokenExpiryDate: {
        type: Date
    }
})

UserSchema.pre('save', async function(){
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10) //rounds
    this.password = await bcrypt.hash(this.password, salt)
})

// UserSchema.virtual('orders', {
//     ref: 'Order',
//     localField: '_id',
//     foreignField:'user',
//     justOne: false
// })

UserSchema.methods.comparePassword = async function (pw) {
    const isMatch = await bcrypt.compare(pw, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)