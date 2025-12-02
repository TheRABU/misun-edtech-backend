"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const course_route_1 = __importDefault(require("../modules/course/course.route"));
const enroll_course_route_1 = __importDefault(require("../modules/course/enroll.course.route"));
const assignment_course_route_1 = __importDefault(require("../modules/course/assignment.course.route"));
const quiz_course_route_1 = __importDefault(require("../modules/course/quiz.course.route"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.default,
    },
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/courses",
        route: course_route_1.default,
    },
    {
        path: "/courses/enroll",
        route: enroll_course_route_1.default,
    },
    {
        path: "/courses/assignments",
        route: assignment_course_route_1.default,
    },
    {
        path: "/courses/quiz",
        route: quiz_course_route_1.default,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
