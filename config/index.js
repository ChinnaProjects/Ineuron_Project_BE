import dotenv from dotenv;

dotenv.config();

const config ={

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
  MONGODB_URL:process.env.MONGODB_URL,
  PORT:process.env.PORT,
  SMPT_MAIL_HOST:process.env.SMPT_MAIL_HOST,
  SMPT_MAIL_PORT:process.env.SMPT_MAIL_PORT,
  SMPT_MAIL_USERNAME:process.env.SMPT_MAIL_USERNAME,
  SMPT_MAIL_PASSWORD:process.env.SMPT_MAIL_PASSWORD,
  SMPT_MAIL_EMAIL:process.env.SMPT_MAIL_EMAIL,
}

export default config;