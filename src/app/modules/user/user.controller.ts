import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";

const createUserWithEmailPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload } = req.body;

    const { email, password, name } = payload;

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

    const user = await UserServices.createUserService(payload);

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
