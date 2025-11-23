import prisma from "../config/prisma.js";

export const ActivityTypeModel = {
  async findByCode(code) {
    return await prisma.activityType.findUnique({
      where: { code },
    });
  },

  async findById(id) {
    return await prisma.activityType.findUnique({
      where: { id },
    });
  },

  async findAll() {
    return await prisma.activityType.findMany({
      orderBy: { id: "asc" },
    });
  },
};
