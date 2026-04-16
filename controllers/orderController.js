const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags = ["Orders"]
  try {
    const orders = await mongodb
      .getDatabase()
      .collection("orders")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error retrieving orders." });
  }
};

const getSingle = async (req, res) => {
  // #swagger.tags = ["Orders"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }
    const orderId = new ObjectId(req.params.id);
    const order = await mongodb
      .getDatabase()
      .collection("orders")
      .findOne({ _id: orderId });
    res.setHeader("Content-Type", "application/json");
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (err) {
    (res.status(500),
      json({ message: err.message || "Error retrieving the order." }));
  }
};

const createOrder = async (req, res) => {
  // // #swagger.tags = ["Orders"]
  try {
    if (!ObjectId.isValid(req.body.user_id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await mongodb
      .getDatabase()
      .collection("users")
      .findOne({ _id: new ObjectId(req.body.user_id) });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const productIds = req.body.products.map((p) => p.product_id);
    const validProductIds = productIds.every((id) => ObjectId.isValid(id));
    if (!validProductIds) {
      return res.status(400).json({
        message: "One or more product IDs are invalid.",
      });
    }

    const productObjectIds = productIds.map((id) => new ObjectId(id));
    console.log("Product Object IDs:", productObjectIds);

    const products = await mongodb
      .getDatabase()
      .collection("products")
      .find({ _id: { $in: productObjectIds } })
      .toArray();

    console.log("Found products:", products);
    console.log("Requested product IDs:", productIds);

    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more product IDs are invalid." });
    }

    const order = {
      user_id: new ObjectId(req.body.user_id),
      codigo: req.body.codigo,
      products: req.body.products.map((p) => ({
        product_id: new ObjectId(p.product_id),
        name: p.name,
        price_at_purchase: p.price_at_purchase,
        quantity: p.quantity,
      })),
      total: req.body.total,
      status: req.body.status,
      created_at: new Date().toISOString(),
    };
    const response = await mongodb
      .getDatabase()
      .collection("orders")
      .insertOne(order);
    if (response.acknowledged) {
      res.status(201).json({
        message: "Order created successfully.",
        id: response.insertedId,
      });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error creating the order." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error creating the order." });
  }
};

const updateOrder = async (req, res) => {
  // #swagger.tags = ["Orders"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const findOrder = await mongodb
      .getDatabase()
      .collection("orders")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!findOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (!ObjectId.isValid(req.body.user_id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await mongodb
      .getDatabase()
      .collection("users")
      .findOne({ _id: new ObjectId(req.body.user_id) });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const productIds = req.body.products.map((p) => p.product_id);
    const validProductIds = productIds.every((id) => ObjectId.isValid(id));
    if (!validProductIds) {
      return res.status(400).json({
        message: "One or more product IDs are invalid.",
      });
    }

    const productObjectIds = productIds.map((id) => new ObjectId(id));

    const products = await mongodb
      .getDatabase()
      .collection("products")
      .find({ _id: { $in: productObjectIds } })
      .toArray();

    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more product IDs are invalid." });
    }

    const orderId = new ObjectId(req.params.id);
    const updateOrder = {
      user_id: new ObjectId(req.body.user_id),
      codigo: req.body.codigo,
      products: req.body.products.map((p) => ({
        product_id: new ObjectId(p.product_id),
        name: p.name,
        price_at_purchase: p.price_at_purchase,
        quantity: p.quantity,
      })),
      total: req.body.total,
      status: req.body.status,
      created_at: new Date().toISOString(),
    };
    const response = await mongodb
      .getDatabase()
      .collection("orders")
      .replaceOne({ _id: orderId }, updateOrder);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Order updated succesfully." });
    } else {
      res.status(500).json({ message: "Error updating order." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating order." });
  }
};

const deleteOrder = async (req, res) => {
  // #swagger.tags = ["Orders"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection("orders")
      .deleteOne({ _id: orderId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Order deleted succesfully" });
    } else {
      res
        .status(500)
        .json({ message: response.error || "Error deleting the order." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error deleting the order." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createOrder,
  updateOrder,
  deleteOrder,
};
