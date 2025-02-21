const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.API);

const msg = {
  to: "kumbharavishkar7@gmail.com", // Change to your recipient
  from: "kumbharavishkar7@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "Testing",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
