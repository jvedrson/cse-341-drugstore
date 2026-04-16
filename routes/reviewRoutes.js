const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { saveReview } = require("../middleware/validate");
const { isAuthenticated } = require('../middleware/isAuthenticated');

router.get("/", reviewController.getAll);
router.get("/:id", reviewController.getSingle);
router.get("/product/:productId", reviewController.getReviewByProductId);
router.get("/user/:userId", reviewController.getReviewByUserId);
router.post("/", isAuthenticated, saveReview, reviewController.createReview);
router.put("/:id", isAuthenticated, saveReview, reviewController.updateReview);
router.delete("/:id", isAuthenticated, reviewController.deleteReview);

module.exports = router