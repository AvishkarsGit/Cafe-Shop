const nodeMailer = require("nodemailer");
class NodeMailer {
  static initiateTransport = () => {
    return nodeMailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.user,
        pass: process.env.password,
      },
    });
  };

  static sendMail = (to, subject, html) => {
    return this.initiateTransport().sendMail({
      to: to,
      subject: subject,
      html: html,
    });
  };
}

module.exports = NodeMailer;
