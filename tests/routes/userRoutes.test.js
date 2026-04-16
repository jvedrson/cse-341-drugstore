const request = require("supertest");
const express = require("express");
const router = require("../../routes/userRoutes");
const userController = require("../../controllers/userController");
const validate = require("../../middleware/validate");

// Mock the user controller methods
jest.mock("../../controllers/userController", () => ({
  getAll: jest.fn(),
  getSingle: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock the saveUser middleware
jest.mock("../../middleware/validate", () => ({
  saveUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users", () => {
    it("should call userController.getAll and return users", async () => {
      const mockUsers = [{ name: "Alice" }, { name: "Bob" }];
      userController.getAll.mockImplementation((req, res) =>
        res.status(200).json(mockUsers),
      );

      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(userController.getAll).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      userController.getAll.mockImplementation((req, res) =>
        res.status(500).json({ error: "Server error" }),
      );

      const res = await request(app).get("/users");

      expect(res.status).toBe(500);
      expect(userController.getAll).toHaveBeenCalled();
    });
  });

  describe("GET /users/:id", () => {
    it("should call userController.getSingle and return a user", async () => {
      const mockUser = { name: "Alice" };
      userController.getSingle.mockImplementation((req, res) =>
        res.status(200).json(mockUser),
      );

      const res = await request(app).get("/users/123");

      expect(res.status).toBe(200);
      expect(userController.getSingle).toHaveBeenCalled();
    });

    it("should return 400 if invalid ID is provided", async () => {
      userController.getSingle.mockImplementation((req, res) =>
        res.status(400).json({ error: "Invalid ID" }),
      );

      const res = await request(app).get("/users/invalid-id");

      expect(res.status).toBe(400);
      expect(userController.getSingle).toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      userController.getSingle.mockImplementation((req, res) =>
        res.status(404).json({ error: "User not found" }),
      );

      const res = await request(app).get("/users/123");

      expect(res.status).toBe(404);
      expect(userController.getSingle).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      userController.getSingle.mockImplementation((req, res) =>
        res.status(500).json({ error: "Server error" }),
      );

      const res = await request(app).get("/users/123");

      expect(res.status).toBe(500);
      expect(userController.getSingle).toHaveBeenCalled();
    });
  });
});
