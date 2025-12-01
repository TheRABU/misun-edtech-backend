import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { User } from "../modules/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        return res.status(404).json({
          success: false,
          message: "Please login again! No token found",
        });
      }

      const verifiedToken = verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
      if (!verifiedToken) {
        return res.status(404).json({
          success: false,
          message: "Could not verify user!",
        });
      }

      const isUserExist = await User.findOne({ email: verifiedToken.email });
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
    } catch (error) {
      console.log("jwt error", error);
      next();
    }
  };
