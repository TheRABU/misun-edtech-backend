"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: formattedErrors,
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
