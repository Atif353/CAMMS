import { UserModel } from '../models/UserModel.js';
import { RoleModel } from '../models/RoleModel.js';
import bcrypt from 'bcryptjs';

export const UserService = {
  async createUser(userData) {
    const { name, email, password, role, phone } = userData;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const roleRecord = await RoleModel.findByName(role);
    if (!roleRecord) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      throw error;
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
      isActive: user.is_active,
    };
  },

  async getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profile_image || null,
      role: user.role_name,
      isActive: user.is_active,
      createdAt: user.created_at,
    };
  },

  async getAllUsers(filters = {}) {
    const users = await UserModel.findAll(filters);
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profile_image || null,
      role: user.role_name,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));
  },

  async updateUser(id, updateData) {
    const { name, email, role, password, isActive, phone } = updateData;
    const updatePayload = {};

    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (phone !== undefined) updatePayload.phone = phone;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    if (role !== undefined) {
      const roleRecord = await RoleModel.findByName(role);
      if (!roleRecord) {
        throw new Error('Invalid role');
      }
      updatePayload.roleId = roleRecord.id;
    }

    if (password && typeof password === 'string' && password.trim().length >= 6) {
      updatePayload.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const user = await UserModel.update(id, updatePayload);
    const roleRecord = await RoleModel.findById(user.role_id);

    const updatedUser = await UserModel.findById(user.id);
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profile_image: updatedUser.profile_image || null,
      role: roleRecord.name,
      isActive: updatedUser.is_active,
    };
  },

  async deleteUser(id) {
    const user = await UserModel.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  },

  async countUsers(filters = {}) {
    return await UserModel.count(filters);
  },
};

