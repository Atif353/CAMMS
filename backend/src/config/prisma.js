import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const getDatabaseUrl = () => {
  // Check if DATABASE_URL is already provided (Railway/Supabase)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Fallback to constructing from individual variables (for local development)
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "1122";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 5432;
  const database = process.env.DB_NAME || "camms_db";

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
};

// Store original DATABASE_URL status before we modify it
const hadOriginalDatabaseUrl = !!process.env.DATABASE_URL;

const databaseUrl = getDatabaseUrl();

// Set DATABASE_URL if it wasn't already set (for Prisma)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

// Log database connection info (masked for security)
if (hadOriginalDatabaseUrl) {
  // If DATABASE_URL was provided directly (Railway/Neon/Supabase), use it
  try {
    const url = new URL(databaseUrl);
    console.log(
      `🔗 Database URL: ${url.protocol}//${url.username}:***@${url.hostname}:${url.port || 5432}${url.pathname}`
    );
    console.log(`   DATABASE_URL is set: true (from environment)`);
  } catch (error) {
    console.log(`🔗 Database URL: [provided but could not parse]`);
    console.log(`   DATABASE_URL is set: true (from environment)`);
  }
} else {
  // Fallback to individual variables (for local development)
  console.log(
    `🔗 Database URL: postgresql://${process.env.DB_USER || "postgres"}:***@${
      process.env.DB_HOST || "localhost"
    }:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "camms_db"}`
  );
  console.log(`   DATABASE_URL is set: false (constructed from DB_* variables)`);
  console.log(`   ⚠️  Warning: DATABASE_URL should be set in Railway!`);
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
