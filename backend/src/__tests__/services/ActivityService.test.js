import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { mockUser, mockActivity } from "../utils/testHelpers.js";
import { ActivityService } from "../../services/ActivityService.js";

describe("ActivityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getActivityById", () => {
    it("should throw error if activity not found with valid UUID", async () => {
      const validNonExistentId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(
        ActivityService.getActivityById(validNonExistentId)
      ).rejects.toThrow("Activity not found");
    });
  });

  describe("updateActivity", () => {
    it("should throw error if activity not found with valid UUID", async () => {
      const validNonExistentId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(
        ActivityService.updateActivity(validNonExistentId, {
          title: "New Title",
        })
      ).rejects.toThrow("Activity not found");
    });
  });

  describe("deleteActivity", () => {
    it("should throw error if activity not found with valid UUID", async () => {
      const validNonExistentId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(
        ActivityService.deleteActivity(validNonExistentId, mockUser.id)
      ).rejects.toThrow("Activity not found");
    });
  });
});
