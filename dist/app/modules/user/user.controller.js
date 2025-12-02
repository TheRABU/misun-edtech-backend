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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const user_model_1 = require("./user.model");
const createUserWithEmailPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required!",
            });
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required!",
            });
        }
        const existingUser = yield user_model_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email!",
            });
        }
        const payload = {
            email,
            name,
            password,
        };
        const user = yield user_model_1.User.create(payload);
        res.status(200).json({
            success: true,
            message: "User created successfully! Please login",
            data: user,
        });
    }
    catch (error) {
        console.log("error creating new user try later", error);
        next();
    }
});
exports.UserControllers = {
    createUserWithEmailPassword,
};
