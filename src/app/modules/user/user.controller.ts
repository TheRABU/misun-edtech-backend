import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";

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

export const UserControllers = {
  createUserWithEmailPassword,
};
