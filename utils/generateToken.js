"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "30d" });
    return token;
};
exports.generateToken = generateToken;
