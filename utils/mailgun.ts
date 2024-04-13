import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "b5a10446ae557ac868d7e039cee61486-9ad3eb61-842342e0", 
});

export const emailTamplateForgotPassword = (name: string, token: string)=> {
  return `
  <h2>Hello ${name},</h2>
  <p>To reset password, please click following link</p>
  <a href="http://localhost:3000/account/resetPassword?token=${token}">Click Here</a>
  `
};
