require("dotenv").config();
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const mailHelper = async( options )=>{

    const transporter = await nodemailer.createTransport(smtpTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        }
    }));

    const message = {
        from: "aakash@best.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };


    // send mail with defined transport object...
    await transporter.sendMail( message );
};

module.exports = mailHelper;

// MAILTRAP_EMAILID=ab1ff0d4ae-18a50c@inbox.mailtrap.io