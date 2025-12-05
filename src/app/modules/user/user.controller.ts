import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";

const createUserWithEmailPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const existingUser = await User.findOne({ email: req.body.email });
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

    const user = await User.create(payload);

    res.status(200).json({
      success: true,
      message: "User created successfully! Please login",
      data: user,
    });
  } catch (error) {
    console.log("error creating new user try later", error);
    next();
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user data",
      });
    }

    const decodedToken = req.user as JwtPayload;

    const userId = decodedToken?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("error fetching user data", error);
    next();
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user data",
      });
    }
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - User is not an admin",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User is an admin",
      data: user,
    });
  } catch (error) {
    console.log("error checking admin role", error);
    next();
  }
};

export const UserControllers = {
  createUserWithEmailPassword,
  getMe,
  isAdmin,
};
