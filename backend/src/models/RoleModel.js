import prisma from '../config/prisma.js';

export const RoleModel = {
  async findByName(name) {
    return await prisma.role.findUnique({
      where: { name },
    });
  },

  async findById(id) {
    return await prisma.role.findUnique({
      where: { id },
    });
  },

  async findAll() {
    return await prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
  },
};
