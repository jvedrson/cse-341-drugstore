const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags = ["Products"]
  try {
    const products = await mongodb
      .getDatabase()
      .collection("products")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving products." });
  }
}

const getSingle = async (req, res) => {
  // #swagger.tags = ["Products"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    const productId = new ObjectId(req.params.id);
    const product = await mongodb
      .getDatabase()
      .collection("products")
      .findOne({ _id: productId });
    res.setHeader("Content-Type", "application/json");
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving product." });
  }
}

const createProduct = async (req, res) => {
  // #swagger.tags = ["Products"]
  try {
    const product = {
        "name": req.body.name,
        "description": req.body.description,
        "price": req.body.price,
        "stock": req.body.stock,
        "is_public": req.body.is_public,
        "active": req.body.active
    }
    const response = await mongodb
          .getDatabase()
          .collection("products")
          .insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({
        message: "Product created successfully.",
        id: response.insertedId,
      });
    } else {
        res
            .status(500)
            .json({ message: response.error || "Error creating the product." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating the product." });
  }
}

const updateProduct = async (req, res) => {
  // #swagger.tags = ["Products"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  try {
    const productId = new ObjectId(req.params.id);
    const product = {
        "name": req.body.name,
        "description": req.body.description,
        "price": req.body.price,
        "stock": req.body.stock,
        "is_public": req.body.is_public,
        "active": req.body.active
    }
    const response = await mongodb
          .getDatabase()
          .collection("products")
          .replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Product updated successfully." });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error updating the product." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating the product." });
  }
}

const deleteProduct = async (req, res) => {
  // #swagger.tags = ["Products"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection("products")
      .deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Product deleted successfully." });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error deleting the product." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting the product." });
  }
}

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
};