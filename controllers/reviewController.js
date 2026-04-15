const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    try {
        const reviews = await mongodb
            .getDatabase()
            .collection("reviews")
            .find()
            .toArray();
        
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error retrieving reviews"
        });
    }
}

const getSingle = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid review ID."})
        }

        const reviewId = new ObjectId(req.params.id);
        const review = await mongodb
            .getDatabase()
            .collection("reviews")
            .findOne({ _id: reviewId });
        
        res.setHeader("Content-Type", "application/json")

        if (review) {
            res.status(200).json(review)
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error retrieving review."
        });
    }
}

const getReviewByProductId = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    try {
        const review = await mongodb
            .getDatabase()
            .collection("reviews")
            .find({ product_id: req.params.productId })      
            .toArray();
        
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error retrieving reviews by Product ID"
        })
    }
}

const getReviewByUserId = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    try {
        const review = await mongodb
            .getDatabase()
            .collection("reviews")
            .find({ user_id: req.params.userId })      
            .toArray();
        
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Error retrieving reviews by User ID"
        })
    }
}

const createReview = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    try {
        if (!ObjectId.isValid(req.body.user_id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }
        const userId = new ObjectId(req.body.user_id);
        const user = await mongodb
            .getDatabase()
            .collection("users")
            .findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const review = {
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            reviewerName: user.name,
            score: req.body.score,
            comment: req.body.comment,
            reviewDate: req.body.reviewDate,
        };

        const response = await mongodb
            .getDatabase()
            .collection("reviews")
            .insertOne(review);
        
        if (response.acknowledged) {
            res.status(201).json({
                message: "Review created successfully",
                id: response.insertedId,
            });
        } else {
            res.status(500).json({ message: "Error creating the review." })
        }
    } catch (err) {
        res.status(500).json({ 
            message: err.message || "Error creating the review." 
        });
    }
}

const updateReview = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    try {
        if (!ObjectId.isValid(req.body.user_id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }
        const userId = new ObjectId(req.body.user_id);
        const user = await mongodb
            .getDatabase()
            .collection("users")
            .findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const reviewId = new ObjectId(req.params.id);
        const review = {
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            reviewerName: req.name,
            score: req.body.score,
            comment: req.body.comment,
            reviewDate: req.body.reviewDate,
        };

        const response = await mongodb
            .getDatabase()
            .collection("reviews")
            .replaceOne({ _id: reviewId }, review);
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Review updated successfully." })
        } else {
            res.status(500).json({ message: "Error updating the review." });
        }
    } catch (err) {
        res.status(500).json({ 
            message: err.message || "Error updating the review." 
        });
    }
}

const deleteReview = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    try {
        const reviewId = new ObjectId(req.params.id);
        const response = await mongodb
            .getDatabase()
            .collection("reviews")
            .deleteOne({ _id: reviewId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Review deleted successfully." });
        } else {
            res.status(500).json({ message: "Error deleting the review." });
        }
    } catch (err) {
        res.status(500).json({ 
            message: err.message || "Error deleting the review." 
        });
    }
}

module.exports = {
    getAll,
    getSingle,
    getReviewByProductId,
    getReviewByUserId,
    createReview,
    updateReview,
    deleteReview
}