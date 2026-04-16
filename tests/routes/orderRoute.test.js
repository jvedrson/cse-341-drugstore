const request = require("supertest");
const express = require("express");
const router = require("../../routes/ordersRouter")
const orderController = require("../../controllers/orderController");
const validate = require("../../middleware/validate");
const { isAuthenticated } = require("../../middleware/isAuthenticated");

jest.mock("../../controllers/orderController", () => ({
    getAll: jest.fn(),
    getSingle: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn()
}));

jest.mock("../../middleware/validate", () => ({
    saveOrder: (req, res, next) => next(),
}));

jest.mock("../../middleware/isAuthenticated", () => ({
    isAuthenticated: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/orders", router);

describe("Order Routes", () => {

    // GET ALL

    describe("GET/ order", () => {
        it("should call orderController.getAll and return Orders", async () => {
            const mockOrders = [{
                "user_id": "69da92639a3f83087ae51ec2",
                "codigo": "123456",
                "products": [
                    {
                        "product_id": "69d854068b1672149bcc3de7",
                        "name": "Paracetamol 500mg",
                        "price_at_purchase": 4.99,
                        "quantity": 2
                    }
                ],
                "total": 9.98,
                "status": "paid",
                "created_at": "2026-04-14T21:30:00.000Z"
            }];
            orderController.getAll.mockImplementation((req, res) => res.status(200).json(mockOrders));

            const res = await request(app).get("/orders");

            expect(res.status).toBe(200);
            expect(orderController.getAll).toHaveBeenCalled();
        });

        it("should handle errors and return 500", async () => {
            const errorMessage = "Database error: Error retrieving orders.";
            orderController.getAll.mockImplementation((req, res) => {
                throw new Error(errorMessage);
            });

            const res = await request(app).get("/orders");

            expect(res.status).toBe(500);
            expect(res.error.text).toContain(errorMessage);
            expect(orderController.getAll).toHaveBeenCalled();
        });
    });

    //GET SINGLE
    //
    describe("GET /orders/:id", () => {
        it("should call orderController.getSingle and return a product", async () => {
            const mockOrder = {
                "user_id": "69da92639a3f83087ae51ec2",
                "codigo": "123456",
                "products": [
                    {
                        "product_id": "69d854068b1672149bcc3de7",
                        "name": "Paracetamol 500mg",
                        "price_at_purchase": 4.99,
                        "quantity": 2
                    }
                ],
                "total": 9.98,
                "status": "paid",
                "created_at": "2026-04-14T21:30:00.000Z"
            };
            orderController.getSingle.mockImplementation((req, res) => res.status(200).json(mockOrder));

            const res = await request(app).get("/orders/69df0681634fce90a33383e2");

            expect(res.status).toBe(200);
            expect(orderController.getSingle).toHaveBeenCalled();
        });

        it("should return 400 if invalid ID is provided", async () => {
            orderController.getSingle.mockImplementation((req, res) =>
                res.status(400).json({ error: "Invalid ID" }),
            );
        
            const res = await request(app).get("/orders/invalid-id");
        
            expect(res.status).toBe(400);
            expect(orderController.getSingle).toHaveBeenCalled();
        });
        
        it("should return 404 if order not found", async () => {
            orderController.getSingle.mockImplementation((req, res) =>
                res.status(404).json({ error: "order not found" }),
            );
    
            const res = await request(app).get("/orders/69df0681634fce90a33383e2");
    
            expect(res.status).toBe(404);
            expect(orderController.getSingle).toHaveBeenCalled();
        });
    
        it("should handle errors and return 500", async () => {
            const errorMessage = "Database error: Error retrieving the order.";
            orderController.getSingle.mockImplementation((req, res) => {
                throw new Error(errorMessage);
            });
    
            const res = await request(app).get("/orders/69df0681634fce90a33383e2");
    
            expect(res.status).toBe(500);
            expect(res.error.text).toContain(errorMessage);
            expect(orderController.getSingle).toHaveBeenCalled();
        });
    });
});