const nodemailer = require('nodemailer');

//  Nodemailer configuration
module.exports = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
  debug: true,
  logger: true,
});
