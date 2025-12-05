import { User } from "../app/modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      return console.log("Admin user already exists. Skipping seeding.");
    }
    const adminUser = new User({
      email: `${process.env.ADMIN_EMAIL}`,
      role: "ADMIN",
      password: await bcrypt.hash(`${process.env.ADMIN_PASS}`, 10),
    });
    await adminUser.save();
    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
