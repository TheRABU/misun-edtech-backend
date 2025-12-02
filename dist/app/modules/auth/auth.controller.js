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
exports.AuthControllers = void 0;
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../../utils/jwt");
// Login
const credentialsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isProduction = process.env.NODE_ENV === "production";
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email must be included!",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password must be included!",
            });
        }
        const isUserExist = yield user_model_1.User.findOne({ email }).select("+password");
        if (!isUserExist) {
            return res.status(404).json({
                success: false,
                message: "User does not exist!",
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password!",
            });
        }
        const jwtPayload = {
            userId: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role,
        };
        const accessToken = (0, jwt_1.generateToken)(jwtPayload, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            data: isUserExist,
        });
    }
    catch (error) {
        console.log("Error could not login", error);
        return res.status(500).json({
            success: false,
            message: "Could not login Internal server issues..",
        });
    }
});
// Logout
const logOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isProduction = process.env.NODE_ENV === "production";
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
        });
        res.status(201).json({
            success: true,
            message: "Logged out successfully!",
            body: null,
        });
    }
    catch (error) {
        console.log("error at auth.controller.ts LOGOUT::", error.message);
        next();
    }
});
exports.AuthControllers = {
    credentialsLogin,
    logOut,
};
