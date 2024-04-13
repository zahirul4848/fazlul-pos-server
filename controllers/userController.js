"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.getUserProfile = exports.updateUserProfile = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("../utils/generateToken");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const mailgun_1 = require("../utils/mailgun");
const validateEmail_1 = require("../utils/validateEmail");
// create new user // api/user // post    // not protected
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield UserModel_1.default.findOne({ email });
    if (!userExists && (0, validateEmail_1.validateEmail)(email)) {
        try {
            const user = yield UserModel_1.default.create({ name, email, password });
            const token = (0, generateToken_1.generateToken)(user);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            });
        }
        catch (err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
    else {
        res.status(400);
        throw new Error("User already exists with this email");
    }
}));
// login user // api/user/login // post  // not protected
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield UserModel_1.default.findOne({ email }).select("+password");
    if (user && (yield user.matchPassword(password))) {
        const token = (0, generateToken_1.generateToken)(user);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid user or password");
    }
}));
// forgot password // api/user/forgotpassword // put  // not protected
exports.forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield UserModel_1.default.findOne({ email });
    if (user) {
        const token = (0, generateToken_1.generateToken)(user);
        const messageData = {
            from: "TrendPeak <johirul016@gmail.com>",
            to: user.email,
            subject: "Password Reset Link",
            html: (0, mailgun_1.emailTamplateForgotPassword)(user.name, token),
        };
        yield user.updateOne({ resetLink: token });
        mailgun_1.mg.messages.create(process.env.MAILGUN_DOMAIN, messageData).then(msg => {
            //console.log(msg)
            res.status(200).json({ message: 'Email has been sent to your email address, please check your email, if you do not get email please check your junk folder' });
        }).catch(err => {
            res.status(400);
            throw new Error(err.message || err.error);
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid Email");
    }
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, token } = req.body;
    if (token && password) {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(401);
                throw new Error("Invalid or expired token");
            }
            else {
                const user = yield UserModel_1.default.findOne({ resetLink: token });
                if (user) {
                    user.password = password;
                    user.resetLink = "";
                    yield user.save();
                    const messageData = {
                        from: "TrendPeak <johirul016@gmail.com>",
                        to: user.email,
                        subject: "Password Reset Successful",
                        text: 'Your password has been reset successfully.',
                    };
                    mailgun_1.mg.messages.create(process.env.MAILGUN_DOMAIN, messageData).then(msg => {
                        //console.log(msg)
                        res.status(200).json({ message: 'Password Reset Successful' });
                    }).catch(err => {
                        res.status(401);
                        throw new Error(err.message || err.error);
                    });
                }
                else {
                    res.status(401);
                    throw new Error("User Not Found");
                }
            }
        }));
    }
    else {
        res.status(401);
        throw new Error("No reset link or password Found");
    }
}));
// edit user profile // api/user/profile // put // protected by user
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield UserModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        user.name = req.body.name || user.name;
        if ((0, validateEmail_1.validateEmail)(req.body.email)) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        const token = (0, generateToken_1.generateToken)(updatedUser);
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token,
        });
    }
    else {
        res.status(401);
        throw new Error("User not found");
    }
}));
// get user profile // api/user/profile // get  // protected by user
exports.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield UserModel_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id).select("-password");
        res.status(200).json(user);
    }
    catch (err) {
        res.status(401);
        throw new Error(err.message);
    }
}));
// get all users // api/user // get  // protected by admin
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name || "";
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    try {
        const users = yield UserModel_1.default.find(Object.assign({}, nameFilter)).select("-password");
        res.status(200).json(users);
    }
    catch (err) {
        res.status(401);
        throw new Error(err.message);
    }
}));
// delete user by id // api/user/:id // delete  // protected by admin
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c._id) == req.params.id) {
            res.status(500);
            throw new Error("You can not delete your user");
        }
        else {
            yield UserModel_1.default.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "User deleted successfully" });
        }
    }
    catch (err) {
        res.status(401);
        throw new Error(err.message);
    }
}));
