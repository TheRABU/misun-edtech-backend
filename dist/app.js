"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// routes
app.use("/api/v1", routes_1.router);
// error handler for zod
app.use(globalErrorHandler_1.globalErrorHandler);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SERVER RUNNING FINE!",
    });
});
exports.default = app;
