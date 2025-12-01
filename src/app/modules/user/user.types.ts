export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
