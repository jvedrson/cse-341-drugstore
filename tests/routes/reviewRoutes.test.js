const request = require("supertest");
const express = require("express");
const router = require("../../routes/reviewRoutes");
const reviewController = require("../../controllers/reviewController");

jest.mock("../../controllers/reviewController", () => ({
  getAll: jest.fn(),
  getSingle: jest.fn(),
  getReviewByProductId: jest.fn(),
  getReviewByUserId: jest.fn(),
  createReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
}));

jest.mock("../../middleware/validate", () => ({
  saveReview: (req, res, next) => next(),
}));

jest.mock("../../middleware/isAuthenticated", () => ({
  isAuthenticated: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/reviews", router);

const validId = "64b1f21c9f1b2c3d4e5f6789";

describe("Review Routes", () => {
beforeEach(() => {
    jest.clearAllMocks();
});

// =============================================
// GET ALL
// =============================================
    describe("GET /reviews", () => {
        it("should call reviewController.getAll and return reviews", async () => {
            const mockReviews = [{ comment: "Great!" }, { comment: "Good product" }];
            reviewController.getAll.mockImplementation((req, res) =>
                res.status(200).json(mockReviews),
            );

            const res = await request(app).get("/reviews");

            expect(res.status).toBe(200);
            expect(reviewController.getAll).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.getAll.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).get("/reviews");

            expect(res.status).toBe(500);
            expect(reviewController.getAll).toHaveBeenCalled();
        });
    });

// =============================================
// GET SINGLE
// =============================================
    describe("GET /reviews/:id", () => {
        it("should call reviewController.getSingle and return a review", async () => {
            const mockReview = { comment: "Great!", score: 5 };
            reviewController.getSingle.mockImplementation((req, res) =>
                res.status(200).json(mockReview),
            );

            const res = await request(app).get(`/reviews/${validId}`);

            expect(res.status).toBe(200);
            expect(reviewController.getSingle).toHaveBeenCalled();
        });

        it("should return 400 if invalid ID is provided", async () => {
            reviewController.getSingle.mockImplementation((req, res) =>
                res.status(400).json({ message: "Invalid review ID." }),
            );

            const res = await request(app).get("/reviews/invalid-id");

            expect(res.status).toBe(400);
            expect(reviewController.getSingle).toHaveBeenCalled();
        });

        it("should return 404 if review not found", async () => {
            reviewController.getSingle.mockImplementation((req, res) =>
                res.status(404).json({ message: "Review not found" }),
            );

            const res = await request(app).get(`/reviews/${validId}`);

            expect(res.status).toBe(404);
            expect(reviewController.getSingle).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.getSingle.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).get(`/reviews/${validId}`);

            expect(res.status).toBe(500);
            expect(reviewController.getSingle).toHaveBeenCalled();
        });
    });

// =============================================
// GET BY PRODUCT ID
// =============================================
    describe("GET /reviews/product/:productId", () => {
        it("should call reviewController.getReviewByProductId and return reviews", async () => {
            const mockReviews = [{ comment: "Great product!", score: 5 }];
            reviewController.getReviewByProductId.mockImplementation((req, res) =>
                res.status(200).json(mockReviews),
            );

            const res = await request(app).get(`/reviews/product/${validId}`);

            expect(res.status).toBe(200);
            expect(reviewController.getReviewByProductId).toHaveBeenCalled();
        });

        it("should return 400 if invalid product ID is provided", async () => {
            reviewController.getReviewByProductId.mockImplementation((req, res) =>
                res.status(400).json({ message: "Invalid product ID." }),
            );

            const res = await request(app).get("/reviews/product/invalid-id");

            expect(res.status).toBe(400);
            expect(reviewController.getReviewByProductId).toHaveBeenCalled();
        });

        it("should return 404 if no reviews found for product", async () => {
            reviewController.getReviewByProductId.mockImplementation((req, res) =>
                res.status(404).json({ message: "Review not found" }),
            );

            const res = await request(app).get(`/reviews/product/${validId}`);

            expect(res.status).toBe(404);
            expect(reviewController.getReviewByProductId).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.getReviewByProductId.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).get(`/reviews/product/${validId}`);

            expect(res.status).toBe(500);
            expect(reviewController.getReviewByProductId).toHaveBeenCalled();
        });
    });

// =============================================
// GET BY USER ID
// =============================================
    describe("GET /reviews/user/:userId", () => {
        it("should call reviewController.getReviewByUserId and return reviews", async () => {
            const mockReviews = [{ comment: "Love it!", score: 4 }];
            reviewController.getReviewByUserId.mockImplementation((req, res) =>
                res.status(200).json(mockReviews),
            );

            const res = await request(app).get(`/reviews/user/${validId}`);

            expect(res.status).toBe(200);
            expect(reviewController.getReviewByUserId).toHaveBeenCalled();
        });

        it("should return 400 if invalid user ID is provided", async () => {
            reviewController.getReviewByUserId.mockImplementation((req, res) =>
                res.status(400).json({ message: "Invalid user ID." }),
            );

            const res = await request(app).get("/reviews/user/invalid-id");

            expect(res.status).toBe(400);
            expect(reviewController.getReviewByUserId).toHaveBeenCalled();
        });

        it("should return 404 if no reviews found for user", async () => {
            reviewController.getReviewByUserId.mockImplementation((req, res) =>
                res.status(404).json({ message: "Reviews not found" }),
            );

            const res = await request(app).get(`/reviews/user/${validId}`);

            expect(res.status).toBe(404);
            expect(reviewController.getReviewByUserId).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.getReviewByUserId.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).get(`/reviews/user/${validId}`);

            expect(res.status).toBe(500);
            expect(reviewController.getReviewByUserId).toHaveBeenCalled();
        });
    });

// =============================================
// POST
// =============================================
    describe("POST /reviews", () => {
        const mockReviewBody = {
            product_id: validId,
            user_id: validId,
            score: 5,
            comment: "Excellent product!",
            reviewDate: "2026-04-16",
        };

        it("should call reviewController.createReview and return 201", async () => {
            reviewController.createReview.mockImplementation((req, res) =>
                res.status(201).json({ message: "Review created successfully", id: "123abc" }),
            );

            const res = await request(app).post("/reviews").send(mockReviewBody);

            expect(res.status).toBe(201);
            expect(reviewController.createReview).toHaveBeenCalled();
        });

        it("should return 400 if validation fails", async () => {
            reviewController.createReview.mockImplementation((req, res) =>
                res.status(400).json({ error: "Validation error" }),
            );

            const res = await request(app).post("/reviews").send({});

            expect(res.status).toBe(400);
            expect(reviewController.createReview).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.createReview.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).post("/reviews").send(mockReviewBody);

            expect(res.status).toBe(500);
            expect(reviewController.createReview).toHaveBeenCalled();
        });
    });

// =============================================
// PUT
// =============================================
    describe("PUT /reviews/:id", () => {
        const mockReviewBody = {
            product_id: validId,
            user_id: validId,
            reviewerName: "John Doe",
            score: 4,
            comment: "Updated comment",
            reviewDate: "2026-04-16",
        };

        it("should call reviewController.updateReview and return 200", async () => {
            reviewController.updateReview.mockImplementation((req, res) =>
                res.status(200).json({ message: "Review updated successfully." }),
            );

            const res = await request(app)
                .put(`/reviews/${validId}`)
                .send(mockReviewBody);

            expect(res.status).toBe(200);
            expect(reviewController.updateReview).toHaveBeenCalled();
        });

        it("should return 400 if invalid ID is provided", async () => {
            reviewController.updateReview.mockImplementation((req, res) =>
                res.status(400).json({ message: "Invalid review ID." }),
            );

            const res = await request(app)
                .put("/reviews/invalid-id")
                .send(mockReviewBody);

            expect(res.status).toBe(400);
            expect(reviewController.updateReview).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.updateReview.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app)
                .put(`/reviews/${validId}`)
                .send(mockReviewBody);

            expect(res.status).toBe(500);
            expect(reviewController.updateReview).toHaveBeenCalled();
        });
    });

// =============================================
// DELETE
// =============================================
    describe("DELETE /reviews/:id", () => {
        it("should call reviewController.deleteReview and return 200", async () => {
            reviewController.deleteReview.mockImplementation((req, res) =>
                res.status(200).json({ message: "Review deleted successfully." }),
            );

            const res = await request(app).delete(`/reviews/${validId}`);

            expect(res.status).toBe(200);
            expect(reviewController.deleteReview).toHaveBeenCalled();
        });

        it("should return 400 if invalid ID is provided", async () => {
            reviewController.deleteReview.mockImplementation((req, res) =>
                res.status(400).json({ message: "Invalid review ID." }),
            );

            const res = await request(app).delete("/reviews/invalid-id");

            expect(res.status).toBe(400);
            expect(reviewController.deleteReview).toHaveBeenCalled();
        });

        it("should return 404 if review not found", async () => {
            reviewController.deleteReview.mockImplementation((req, res) =>
                res.status(404).json({ message: "Review not found" }),
            );

            const res = await request(app).delete(`/reviews/${validId}`);

            expect(res.status).toBe(404);
            expect(reviewController.deleteReview).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            reviewController.deleteReview.mockImplementation((req, res) =>
                res.status(500).json({ error: "Server error" }),
            );

            const res = await request(app).delete(`/reviews/${validId}`);

            expect(res.status).toBe(500);
            expect(reviewController.deleteReview).toHaveBeenCalled();
        });
    });
});