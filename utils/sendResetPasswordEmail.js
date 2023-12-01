const sgMail = require('@sendgrid/mail')

const sendResetPasswordEmail = async({email, token, origin}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log('Email sent');
    const resetLink = `${origin}/forgot-password?token=${token}&email=${email}`
    const message = `<p>Reset password by clicking on the following link: <a href="${resetLink}">reset password</p>`
    const mail = {
        to: email,
        from: 'quanbui021001@gmail.com',
        subject: 'Reset Password',
        html: message
    }
    try {
        await sgMail.send(mail);
    } catch (error) {
        console.error(error);
  }
}

module.exports = sendResetPasswordEmail