const nodemailer = require('nodemailer');
const html = require('escape-html-template');

exports.handler = function (event, context, callback) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
  });

  let body = JSON.parse(event.body)
  console.log(body)
  let name = body.fname + ' ' + body.lname

  if(!body.resno) {
    body.resno = '(not provided)'
  }
  if(!body.depot) {
    body.depot = '(not provided)'
  }

  const safeHtml = html `
  <h2>Allridey Contact Form</h2>
  <table>
  <tr><th style="text-align: left" colspan="2"><h4><br>Customer Details<br></h4><th></tr>
  <tr></tr>
  <tr><td>Name: </td><td>${name}</td></tr>
  <tr><td>Email: </td><td><a href="mailto:${body.email}">${body.email}</a></td></tr>
  <tr><td>Phone: </td><td><a href="tel:${body.phone}">${body.phone}</a></td></tr>
  <tr></tr>
  <tr><td>Reference No.: </td><td>${body.resno}</td></tr>
  <tr><td>Location: </td><td>${body.depot}</td></tr>
  </table>

  <h4 style="margin: 1rem 0"><br>Message<br></h4>
  <p>${body.message}</p>
  `

  let mailOptions = {
    from: `"Allridey Online" <${process.env.MAIL_USER}>`,
    replyTo: body.email,
    to: process.env.MAIL_TO,
    subject: 'Allridey Web Enquiry',
    text: event.body,
    html: safeHtml.$
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      callback(null, {
        statusCode: 500,
        body: error.toString(),
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: "Ok"
      });
    }
  });
}