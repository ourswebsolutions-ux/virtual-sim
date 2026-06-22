import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("rashidadminshb", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "rashidco197@gmail.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      email: "rashidco197@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      fullName: "Admin",
    },
  });

  console.log("✅ Admin user seeded:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });