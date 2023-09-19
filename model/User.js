const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide username'],
        unique: {
            value: true,
            message: 'username existed'
        }
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: ['User']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (pw) {
    const isMatch = await bcrypt.compare(pw, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)