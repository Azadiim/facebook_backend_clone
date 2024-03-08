import nodemailer from "nodemailer";

const sendResetCode = (name, code, mail) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.NODE_PASS,
    },
  });

  var mailOptions = {
    from: "azadamiri88@gmail.com",
    to: mail,
    subject: `Sending recovery password to  ${name}`,
    text: `your activation code is:  ${code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendResetCode;
