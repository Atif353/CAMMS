import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "1122";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 5432;
  const database = process.env.DB_NAME || "camms_db";

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
};

const databaseUrl = getDatabaseUrl();

process.env.DATABASE_URL = databaseUrl;

console.log(
  `🔗 Database URL: postgresql://${process.env.DB_USER || "postgres"}:***@${
    process.env.DB_HOST || "localhost"
  }:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "camms_db"}`
);
console.log(`   DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
