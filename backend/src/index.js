import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import config from "./config/env.js";
import logger, { consoleLogger, requestLogger } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { swaggerSpec } from "./config/swagger.js";
import { validateEnv } from "./config/validateEnv.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { sanitizeInput } from "./middleware/sanitize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

// Validate environment variables with better error handling
try {
  validateEnv();
} catch (error) {
  logger.error("❌ Environment validation failed:");
  logger.error(error.message);
  logger.error(
    "\n💡 Make sure these environment variables are set in Railway:"
  );
  logger.error("   - DATABASE_URL (required)");
  logger.error("   - JWT_SECRET (required, min 32 chars)");
  logger.error("   - JWT_REFRESH_SECRET (required, min 32 chars)");
  logger.error("   - PORT (optional, Railway sets this automatically)");
  process.exit(1);
}

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// CORS configuration - allow production and development origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite default dev port
  config.frontendUrl,
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow all origins for easier testing
      if (config.nodeEnv === "development") {
        return callback(null, true);
      }

      // In production, check against allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(consoleLogger);
app.use(requestLogger);

const assetsPath = path.join(__dirname, "../../frontend/public/assets");
app.use(
  "/assets",
  express.static(assetsPath, {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CAMMS API Documentation",
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "CAMMS API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;
const HOST = process.env.HOST || "0.0.0.0"; // Railway requires binding to 0.0.0.0

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    logger.info(`🚀 Server running on ${HOST}:${PORT}`);
    logger.info(`📊 Environment: ${config.nodeEnv}`);
    logger.info(`🔗 API: http://${HOST}:${PORT}/api`);
    logger.info(`📚 Swagger Docs: http://${HOST}:${PORT}/api-docs`);
  });
}

export default app;
