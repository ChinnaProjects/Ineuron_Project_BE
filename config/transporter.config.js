import nodemailer from "nodemailer";
import config from "./index";

const transporter = nodemailer.createTransport({
  host: config.SMPT_MAIL_HOST, //"smtp.ethereal.email",
  port: config.SMPT_MAIL_PORT, //587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.SMPT_MAIL_USERNAME, //"maddison53@ethereal.email",
    pass: config.SMPT_MAIL_PASSWORD, //"jn7jnAPss4f63QBp6D",
  },
});

export default transporter;
