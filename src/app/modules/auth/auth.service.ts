import { NextFunction, Request, Response } from "express";
import { generateToken } from "../../../utils/jwt";
import AppError from "../../helpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/user.types";
import bcrypt from "bcryptjs";

const credentialsLoginService = async (
  payload: Partial<IUser>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = payload;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email must be included!",
    });
    throw new AppError(400, "Email must be included!");
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password must be included!",
    });
    throw new AppError(400, "Password must be included!");
  }

  const isUserExist = await User.findOne({ email }).select("+password");

  if (!isUserExist) {
    return res.status(404).json({
      success: false,
      message: "User does not exist!",
    });
    throw new AppError(400, "User does not exist");
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
    throw new Error("Incorrect Password");
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

  return {
    accessToken,
    user: isUserExist,
  };
};

export const AuthServices = {
  credentialsLoginService,
};
