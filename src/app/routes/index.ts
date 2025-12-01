import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import authRoutes from "../modules/auth/auth.route";
import courseRoutes from "../modules/course/course.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/courses",
    route: courseRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
