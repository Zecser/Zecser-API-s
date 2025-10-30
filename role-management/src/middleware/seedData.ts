import bcrypt from "bcryptjs";
import RoleModel from "../models/Role.js";
import UserModel from "../models/User.js";

export const seedRolesAndAdmin = async (): Promise<void> => {
  try {
    // Seed roles
    const roles = [
      { name: "Admin", permissions: ["manage_users", "manage_moderators", "manage_roles"] },
      { name: "Moderator", permissions: ["manage_users_limited", "view_logs"] },
      { name: "User", permissions: ["view_content"] },
    ];

    for (const role of roles) {
      const exists = await RoleModel.findOne({ name: role.name });
      if (!exists) {
        await RoleModel.create(role);
        console.log(` Role created: ${role.name}`);
      }
    }

    // Seed admin user
    const adminEmail = "admin@example.com";
    const admin = await UserModel.findOne({ email: adminEmail });

    if (!admin) {
      const adminRole = await RoleModel.findOne({ name: "Admin" });
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await UserModel.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: adminRole?._id,
      });
      console.log("Admin user created: admin@example.com / admin123");
    } else {
      console.log("Admin already exists:", adminEmail);
    }
  } catch (error) {
    console.error(" Error while seeding:", error);
  }
};