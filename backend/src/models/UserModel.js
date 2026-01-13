import prisma from '../config/prisma.js';

export const UserModel = {
  async create(userData) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
        roleId: userData.roleId,
        phone: userData.phone || null,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.roleId,
      is_active: user.isActive,
      created_at: user.createdAt,
    };
  },

  async findByEmail(email) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profileImage,
      password_hash: user.passwordHash,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      role_name: user.role.name,
    };
  },

  async findById(id, includeInactive = false) {
    const where = { id };
    if (!includeInactive) {
      where.isActive = true;
    }

    const user = await prisma.user.findFirst({
      where,
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profileImage,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      role_name: user.role.name,
    };
  },

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.role) {
      where.role = {
        name: filters.role,
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: filters.limit,
      skip: filters.offset,
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profileImage || '',
      is_active: user.isActive,
      created_at: user.createdAt,
      role_name: user.role.name,
    }));
  },

  async update(id, updateData) {
    const data = {};
    
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.email !== undefined) data.email = updateData.email;
    if (updateData.phone !== undefined) data.phone = updateData.phone;
    if (updateData.roleId !== undefined) data.roleId = updateData.roleId;
    if (updateData.isActive !== undefined) data.isActive = updateData.isActive;
    if (updateData.passwordHash !== undefined) data.passwordHash = updateData.passwordHash;

    if (Object.keys(data).length === 0) {
      return await this.findById(id);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role_id: updated.roleId,
      is_active: updated.isActive,
      updated_at: updated.updatedAt,
    };
  },

  async updateProfileImage(id, imagePath) {
    const updated = await prisma.user.update({
      where: { id },
      data: { profileImage: imagePath },
    });

    return {
      id: updated.id,
      profile_image: updated.profileImage,
    };
  },

  async delete(id) {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  },

  async count(filters = {}) {
    const where = {};
    
    if (filters.role) {
      where.role = {
        name: filters.role,
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.user.count({ where });
  },
};
