import transporter from "../config/transporter.config.js";
import config from "../config/index.js";
const mailhelper = async (options) => {
  const message = {
    from: config.SMPT_MAIL_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html: "<b>Hello world?</b>", // html body
  };
};
