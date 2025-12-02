export enum Role {
  STUDENT = "student",
  ADMIN = "ADMIN",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
