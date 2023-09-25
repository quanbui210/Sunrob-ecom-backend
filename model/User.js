const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

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
        minlength: 5,
        maxlength: 30
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10) //rounds
    this.password = await bcrypt.hash(this.password, salt)
})

// UserSchema.methods.signJWT = async function () {
//     await jwt.sign({

//     })
// }

UserSchema.methods.comparePassword = async function (pw) {
    const isMatch = await bcrypt.compare(pw, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)