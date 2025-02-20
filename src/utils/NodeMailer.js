const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

class NodeMailer {
  static sendingMail = (to, name, verification_token, subject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail.send({
      from: {
        email: "kumbharavishkar7@gmail.com",
        name: "Raje Royal Cafe",
      },
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          dynamicTemplateData: {
            name: name,
            otp: verification_token,
            subject: subject,
          },
        },
      ],
      templateId: "d-1e26070cbfd54e66bc249f9529d8de69",
    });
  };
  static sendResetPasswordEmail = (to, name, verification_link, subject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail.send({
      from: {
        email: "kumbharavishkar7@gmail.com",
        name: "Raje Royal Cafe",
      },
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          dynamicTemplateData: {
            name: name,
            verification_link: verification_link,
            subject: subject,
          },
        },
      ],
      templateId: "d-e50a5e034fde4936933918a81658cc43",
    });
  };
}

module.exports = NodeMailer;
