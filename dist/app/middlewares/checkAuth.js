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
exports.checkAuth = void 0;
const jwt_1 = require("../../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(404).json({
                success: false,
                message: "Please login again! No token found",
            });
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, process.env.JWT_ACCESS_SECRET);
        if (!verifiedToken) {
            return res.status(404).json({
                success: false,
                message: "Could not verify user!",
            });
        }
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
        if (!authRoles.includes(verifiedToken.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not permitted to view this route!!!",
            });
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next();
    }
});
exports.checkAuth = checkAuth;
