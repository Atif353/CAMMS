import bcrypt from 'bcryptjs';
import { UserModel } from '../models/UserModel.js';
import { RoleModel } from '../models/RoleModel.js';
import { SettingModel } from '../models/SettingModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const AuthService = {
  async signup(userData) {
    // Check maintenance mode
    const maintenanceSetting = await SettingModel.findByKey('MAINTENANCE_MODE');
    const isMaintenanceMode = maintenanceSetting && maintenanceSetting.value === 'true';
    
    if (isMaintenanceMode) {
      const error = new Error('System is currently under maintenance. Registration is temporarily disabled.');
      error.statusCode = 503;
      throw error;
    }

    const { name, email, password, role, phone } = userData;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const roleRecord = await RoleModel.findByName(role);
    if (!roleRecord) {
      throw new Error('Invalid role');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      passwordHash,
      roleId: roleRecord.id,
      phone,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: role,
    };
  },

  async login(email, password) {
    // Check maintenance mode setting
    const maintenanceSetting = await SettingModel.findByKey('MAINTENANCE_MODE');
    const isMaintenanceMode = maintenanceSetting && maintenanceSetting.value === 'true';
    
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Maintenance mode check: Block all non-ADMIN users during maintenance
    // ADMIN users can still login during maintenance mode
    if (isMaintenanceMode && user.role_name !== 'ADMIN') {
      const error = new Error('System is currently under maintenance. Only administrators can access the system at this time. Please try again later.');
      error.statusCode = 503;
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate tokens
    const payload = {
      sub: user.id,
      role: user.role_name,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image || null,
        role: user.role_name,
      },
    };
  },
};

