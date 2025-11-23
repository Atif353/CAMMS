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
import fs from "fs";
import path from "path";

dotenv.config();

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`📁 Created uploads directory: ${uploadsDir}`);
}

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

// Trust proxy - required for Railway to get correct protocol and host
// This allows Express to read x-forwarded-proto and x-forwarded-host headers
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  config.frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (config.nodeEnv === "development") {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin && origin.includes("vercel.app")) {
        callback(null, true);
      } else if (origin && origin.includes("netlify.app")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Type", "Authorization"],
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

// Swagger UI setup with dynamic server URL
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", (req, res, next) => {
  // Dynamically set the server URL based on the current request
  // Railway sets x-forwarded-proto header, and with trust proxy, req.protocol will be correct
  let protocol = req.protocol;

  // In production (Railway), always use HTTPS
  if (config.nodeEnv === "production") {
    protocol = "https";
  } else {
    // In development, use the detected protocol or default to http
    const forwardedProto = req.headers["x-forwarded-proto"];
    if (forwardedProto) {
      protocol = forwardedProto.split(",")[0].trim();
    } else if (!protocol) {
      protocol = "http";
    }
  }

  const host = req.get("host") || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Log for debugging (remove in production if needed)
  if (config.nodeEnv === "development") {
    logger.info(`Swagger UI: Using base URL: ${baseUrl}/api`);
  }

  // Create a modified swagger spec with the current server URL
  const modifiedSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${baseUrl}/api`,
        description:
          config.nodeEnv === "production"
            ? "Production server"
            : "Development server",
      },
      // Keep localhost for local development reference
      ...(config.nodeEnv === "development"
        ? [
            {
              url: "http://localhost:5000/api",
              description: "Local development server",
            },
          ]
        : []),
    ],
  };

  const swaggerUiHandler = swaggerUi.setup(modifiedSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CAMMS API Documentation",
  });

  swaggerUiHandler(req, res, next);
});

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
