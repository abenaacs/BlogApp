const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.authEmail.user,
    pass: config.authEmail.pass,
  },
});

module.exports = transporter;
