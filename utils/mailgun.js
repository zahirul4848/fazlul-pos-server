"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTamplateForgotPassword = exports.mg = void 0;
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
const mailgun = new mailgun_js_1.default(form_data_1.default);
exports.mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "b5a10446ae557ac868d7e039cee61486-9ad3eb61-842342e0",
});
const emailTamplateForgotPassword = (name, token) => {
    return `
  <h2>Hello ${name},</h2>
  <p>To reset password, please click following link</p>
  <a href="http://localhost:3000/account/resetPassword?token=${token}">Click Here</a>
  `;
};
exports.emailTamplateForgotPassword = emailTamplateForgotPassword;
