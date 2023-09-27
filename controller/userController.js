const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')
const getAllUsers = async(req, res) => {
    const allUsers = await User.find({role: "User"}).select("-password")
    if (allUsers.length < 1) {
        res.json({msg: "no user found"})
    }
    res.status(StatusCodes.OK).json({allUsers})
}
const getOneUser = async(req, res) => {
    const user = await User.findOne({_id: req.params.id}).select("-password")
    if (!user) {
        res.json({msg: `no user with id:${req.params.id} found`})
    }
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async(req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}
const updateUser = async(req, res) => {
    res.send(req.body)
}
const updateUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body
    console.log(oldPassword, newPassword, req.user.userId)
    const user = await User.findOne({_id: req.user.userId})
    
    if (!oldPassword || !newPassword) {
        throw new Error('please provide enough info')
    }    console.log(user)
    const passwordMatches = await user.comparePassword(oldPassword)
    if (!passwordMatches) {
        throw new Error('password does not match')
    } 
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({
        msg: "Password update successfully",
    })
    res.send('pw')
}
const deleteUser = async(req, res) => {
    res.send('Ban user')
}


module.exports = {
    getAllUsers, getOneUser, showCurrentUser,
    updateUser, updateUserPassword, deleteUser
}
