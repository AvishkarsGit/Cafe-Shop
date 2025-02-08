const nodemailer = require("nodemailer");

require("dotenv").config();

class NodeMailer {
  static initiateTransport = () => {
    return nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "kumbharavishkar7@gmail.com",
        pass: "tfsqwjpemjjzkdyx",
      },
    });
  };

  static sendingMail = (to, subject, doctype_html) => {
    return this.initiateTransport().sendMail({
      to: to,
      subject: subject,
      html: doctype_html,
    });
  };
}

module.exports = NodeMailer;
