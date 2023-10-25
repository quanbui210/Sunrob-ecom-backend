const jwt = require('jsonwebtoken')

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    return token
}

const validToken = ({token}) => {
   return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookies = ({req, res, user }) => {
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 24;
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    console.log(isSecure, req.secure);
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        signed: true,
        secure: isSecure, // Set secure to true for HTTPS if the connection is secure
        sameSite: 'None', // Allow cross-domain cookies
    });
};

module.exports = {createJWT, validToken, attachCookies}