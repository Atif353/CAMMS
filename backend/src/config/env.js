import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "camms_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  pythonService: {
    path: process.env.PYTHON_SERVICE_PATH || "./services/reporting_service.py",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
