import prisma from "../config/prisma.js";

export const SettingModel = {
  async findByKey(key) {
    return await prisma.setting.findUnique({
      where: { key },
    });
  },

  async findAll() {
    return await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });
  },

  async create(key, value) {
    return await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },

  async update(key, value) {
    return await prisma.setting.update({
      where: { key },
      data: { value },
    });
  },
};
