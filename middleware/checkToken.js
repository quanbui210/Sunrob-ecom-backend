const { verify } = require("jsonwebtoken")

const checkTokenExist = (req, res, next) => {
    let token = req.cookies.token
    if (token && verify(token)) {
        next()
    } else {
        res.redirect('/')
    }
}