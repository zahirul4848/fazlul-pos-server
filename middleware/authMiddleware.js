"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
            }
            else {
                const { _id, name, email, role } = decoded;
                req.user = { _id, name, email, role };
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: "no token" });
    }
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (req.user && role === "ADMIN") {
        next();
    }
    else {
        res.status(401).json({ message: "Invalid admin token" });
    }
};
exports.isAdmin = isAdmin;
