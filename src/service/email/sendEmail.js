import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "a7med3li0111@gmail.com",
      pass: "rnfr xfmy lqsq aecz",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'AMAZON.COM', // sender address
    to: `${options.email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: emailTemplate(options.api), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
