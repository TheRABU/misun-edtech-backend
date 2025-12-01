import { User } from "./user.model";
import { IUser } from "./user.types";

export const createUserService = async (payload: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }
};

export const UserServices = {
  createUserService,
};
