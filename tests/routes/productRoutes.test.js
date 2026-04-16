const request = require("supertest");
const express = require("express");
const router = require("../../routes/productRoutes");
const productController = require("../../controllers/productController");
const validate = require("../../middleware/validate");

jest.mock("../../controllers/productController", () => ({
  getAll: jest.fn(),
  getSingle: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  isAuthenticated: (req, res, next) => next(),
}));

jest.mock("../../middleware/validate", () => ({
  saveProduct: (req, res, next) => next(),
}));

jest.mock("../../middleware/isAuthenticated", () => ({
  isAuthenticated: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/products", router);

describe("Product Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // GET ALL
  // =============================================
  describe("GET /products", () => {
    it("should call productController.getAll and return products", async () => {
      const mockProducts = [{ name: "Aspirina" }, { name: "Ibuprofeno" }];
      productController.getAll.mockImplementation((req, res) =>
        res.status(200).json(mockProducts),
      );

      const res = await request(app).get("/products");

      expect(res.status).toBe(200);
      expect(productController.getAll).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      const errorMessage = "Database error: Error retrieving products.";
      productController.getAll.mockImplementation((req, res) => {
        throw new Error(errorMessage);
      });

      const res = await request(app).get("/products");

      expect(res.status).toBe(500);
      expect(res.error.text).toContain(errorMessage);
      expect(productController.getAll).toHaveBeenCalled();
    });
  });

  // =============================================
  // GET SINGLE
  // =============================================
  describe("GET /products/:id", () => {
    it("should call productController.getSingle and return a product", async () => {
      const mockProduct = { name: "Aspirina", price: 5.99 };
      productController.getSingle.mockImplementation((req, res) =>
        res.status(200).json(mockProduct),
      );

      const res = await request(app).get("/products/64b1f21c9f1b2c3d4e5f6789");

      expect(res.status).toBe(200);
      expect(productController.getSingle).toHaveBeenCalled();
    });

    it("should return 400 if invalid ID is provided", async () => {
      productController.getSingle.mockImplementation((req, res) =>
        res.status(400).json({ error: "Invalid ID" }),
      );

      const res = await request(app).get("/products/invalid-id");

      expect(res.status).toBe(400);
      expect(productController.getSingle).toHaveBeenCalled();
    });

    it("should return 404 if product not found", async () => {
      productController.getSingle.mockImplementation((req, res) =>
        res.status(404).json({ error: "Product not found" }),
      );

      const res = await request(app).get("/products/64b1f21c9f1b2c3d4e5f6789");

      expect(res.status).toBe(404);
      expect(productController.getSingle).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      const errorMessage = "Database error: Error retrieving the product.";
      productController.getSingle.mockImplementation((req, res) => {
        throw new Error(errorMessage);
      });

      const res = await request(app).get("/products/64b1f21c9f1b2c3d4e5f6789");

      expect(res.status).toBe(500);
      expect(res.error.text).toContain(errorMessage);
      expect(productController.getSingle).toHaveBeenCalled();
    });
  });

  // =============================================
  // POST
  // =============================================
  describe("POST /products", () => {
    const mockProductBody = {
      name: "Aspirina",
      description: "Analgésico",
      price: 5.99,
      stock: 100,
      is_public: true,
      active: true,
    };

    it("should call productController.createProduct and return 201", async () => {
      productController.createProduct.mockImplementation((req, res) =>
        res
          .status(201)
          .json({ message: "Product created successfully.", id: "123abc" }),
      );

      const res = await request(app).post("/products").send(mockProductBody);

      expect(res.status).toBe(201);
      expect(productController.createProduct).toHaveBeenCalled();
    });

    it("should return 400 if validation fails", async () => {
      productController.createProduct.mockImplementation((req, res) =>
        res.status(400).json({ error: "Validation error" }),
      );

      const res = await request(app).post("/products").send({});

      expect(res.status).toBe(400);
      expect(productController.createProduct).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      const errorMessage = "Database error: Error creating the product.";
      productController.createProduct.mockImplementation((req, res) => {
        throw new Error(errorMessage);
      });

      const res = await request(app).post("/products").send(mockProductBody);

      expect(res.status).toBe(500);
      expect(res.error.text).toContain(errorMessage);
      expect(productController.createProduct).toHaveBeenCalled();
    });
  });

  // =============================================
  // PUT
  // =============================================
  describe("PUT /products/:id", () => {
    const mockProductBody = {
      name: "Aspirina Plus",
      description: "Actualizado",
      price: 7.99,
      stock: 50,
      is_public: false,
      active: true,
    };

    it("should call productController.updateProduct and return 200", async () => {
      productController.updateProduct.mockImplementation((req, res) =>
        res.status(200).json({ message: "Product updated successfully." }),
      );

      const res = await request(app)
        .put("/products/64b1f21c9f1b2c3d4e5f6789")
        .send(mockProductBody);

      expect(res.status).toBe(200);
      expect(productController.updateProduct).toHaveBeenCalled();
    });

    it("should return 400 if invalid ID is provided", async () => {
      productController.updateProduct.mockImplementation((req, res) =>
        res.status(400).json({ error: "Invalid ID" }),
      );

      const res = await request(app)
        .put("/products/invalid-id")
        .send(mockProductBody);

      expect(res.status).toBe(400);
      expect(productController.updateProduct).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      const errorMessage = "Database error: Error updating the product.";
      productController.updateProduct.mockImplementation((req, res) => {
        throw new Error(errorMessage);
      });

      const res = await request(app)
        .put("/products/64b1f21c9f1b2c3d4e5f6789")
        .send(mockProductBody);

      expect(res.status).toBe(500);
      expect(res.error.text).toContain(errorMessage);
      expect(productController.updateProduct).toHaveBeenCalled();
    });
  });

  // =============================================
  // DELETE
  // =============================================
  describe("DELETE /products/:id", () => {
    it("should call productController.deleteProduct and return 200", async () => {
      productController.deleteProduct.mockImplementation((req, res) =>
        res.status(200).json({ message: "Product deleted successfully." }),
      );

      const res = await request(app).delete(
        "/products/64b1f21c9f1b2c3d4e5f6789",
      );

      expect(res.status).toBe(200);
      expect(productController.deleteProduct).toHaveBeenCalled();
    });

    it("should return 400 if invalid ID is provided", async () => {
      productController.deleteProduct.mockImplementation((req, res) =>
        res.status(400).json({ error: "Invalid ID" }),
      );

      const res = await request(app).delete("/products/invalid-id");

      expect(res.status).toBe(400);
      expect(productController.deleteProduct).toHaveBeenCalled();
    });

    it("should return 404 if product not found", async () => {
      productController.deleteProduct.mockImplementation((req, res) =>
        res.status(404).json({ error: "Product not found" }),
      );

      const res = await request(app).delete(
        "/products/64b1f21c9f1b2c3d4e5f6789",
      );

      expect(res.status).toBe(404);
      expect(productController.deleteProduct).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      const errorMessage = "Database error: Error deleting the product.";
      productController.deleteProduct.mockImplementation((req, res) => {
        throw new Error(errorMessage);
      });

      const res = await request(app).delete(
        "/products/64b1f21c9f1b2c3d4e5f6789",
      );

      expect(res.status).toBe(500);
      expect(res.error.text).toContain(errorMessage);
      expect(productController.deleteProduct).toHaveBeenCalled();
    });
  });
});
