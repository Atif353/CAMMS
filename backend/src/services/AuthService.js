import bcrypt from 'bcryptjs';
import { UserModel } from '../models/UserModel.js';
import { RoleModel } from '../models/RoleModel.js';
import { SettingModel } from '../models/SettingModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';

export const AuthService = {
  async signup(userData) {
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
    
    // Find user by email (including inactive users to check status)
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error('Your account has been deactivated. Please contact an administrator.');
      error.statusCode = 403;
      throw error;
    }

    if (isMaintenanceMode && user.role.name !== 'ADMIN') {
      const error = new Error('System is currently under maintenance. Only administrators can access the system at this time. Please try again later.');
      error.statusCode = 503;
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      sub: user.id,
      role: user.role.name,
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
        profile_image: user.profileImage || null,
        role: user.role.name,
      },
    };
  },
};

