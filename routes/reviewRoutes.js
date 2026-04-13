const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { saveReview } = require("../middleware/validate");

router.get("/", reviewController.getAll);
router.get("/:id", reviewController.getSingle);
router.get("/product/:productId", reviewController.getReviewByProductId);
router.get("/user/:userId", reviewController.getReviewByUserId);
router.post("/", saveReview, reviewController.createReview);
router.put("/:id", saveReview, reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router