import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { AuthService } from "../../services/AuthService.js";

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should throw error for invalid credentials", async () => {
      await expect(
        AuthService.login("nonexistent@example.com", "wrongpassword")
      ).rejects.toThrow();
    });
  });

  describe("signup", () => {
    it("should throw error for invalid email format", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        role: "INSTRUCTOR",
      };

      await expect(AuthService.signup(userData)).rejects.toThrow();
    });
  });
});
