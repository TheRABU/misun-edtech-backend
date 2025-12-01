import { NextFunction, Request } from "express";

export const createUserWithEmailPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    console.log("error creating new user try later", error);
    next();
  }
};
