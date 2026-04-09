const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const users = await mongodb
      .getDatabase()
      .collection("users")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving users." });
  }
};

const getSingle = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
      .getDatabase()
      .collection("users")
      .findOne({ _id: userId });
    res.setHeader("Content-Type", "application/json");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error retrieving the user." });
  }
};

const createUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const user = {
      github_id: req.body.github_id,
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const response = await mongodb
      .getDatabase()
      .collection("users")
      .insertOne(user);
    if (response.acknowledged) {
      res.status(201).json({
        message: "User created successfully.",
        id: response.insertedId,
      });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error creating the user." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error creating the user." });
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const response = await mongodb
      .getDatabase()
      .collection("users")
      .replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "User updated successfully." });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error updating the user." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error updating the user." });
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection("users")
      .deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error deleting the user." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error deleting the user." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
