const transporter = require('../utils/email-transporter');
const config = require('../config/config');


const signUp =  async (user) => {
  await transporter.sendMail({
    from: config.authEmail.user,
    to: user.email,
    subject: 'Successfully Registered',
    text: 'Thanks for signing up',
  });

}

module.exports = {
    signup: signUp,
}