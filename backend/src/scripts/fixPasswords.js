import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

async function fixPasswords() {
  try {
    console.log("🔧 Resetting password hashes with Prisma...");

    const adminPassword = await bcrypt.hash("adminpass", 10);
    const instructorPassword = await bcrypt.hash("instructorpass", 10);

    await prisma.user.updateMany({
      where: { email: "admin@example.com" },
      data: { passwordHash: adminPassword },
    });
    console.log("✅ Admin password reset (admin@example.com / adminpass)");

    await prisma.user.updateMany({
      where: { email: { in: ["instructor@example.com", "instructor2@example.com"] } },
      data: { passwordHash: instructorPassword },
    });
    console.log("✅ Instructor passwords reset (instructor@example.com / instructorpass)");

    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });
    
    if (adminUser) {
      const isValid = await bcrypt.compare("adminpass", adminUser.passwordHash);
      console.log(`✅ Password verification: ${isValid ? "PASSED" : "FAILED"}`);
    }

    console.log("🎉 Password reset completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting passwords:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();

