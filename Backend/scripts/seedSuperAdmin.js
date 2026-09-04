require("dotenv").config();

const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../feature/user/user.model");

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existingSuperAdmin = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
      role: "super_admin",
    });

    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10,
    );

    await User.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "super_admin",
    });

    console.log("🎉 Super Admin created successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
