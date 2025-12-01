import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/jwt";

// Login

const credentialsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const isUserExist = await User.findOne({ email }).select("+password");
    if (!isUserExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }
    const isPasswordMatched = await bcrypt.compare(
      password as string,
      isUserExist.password as string
    );

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
    const accessToken = generateToken(
      jwtPayload,
      process.env.JWT_ACCESS_SECRET as string,
      process.env.JWT_ACCESS_EXPIRES as string
    );

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
  } catch (error) {
    console.log("Error could not login", error);
    return res.status(500).json({
      success: false,
      message: "Could not login Internal server issues..",
    });
  }
};

// Logout

const logOut = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error: any) {
    console.log("error at auth.controller.ts LOGOUT::", error.message);
    next();
  }
};

export const AuthControllers = {
  credentialsLogin,
  logOut,
};
