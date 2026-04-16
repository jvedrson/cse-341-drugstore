const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { saveProduct } = require("../middleware/validate");
const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get("/", productController.getAll);
router.get("/:id", productController.getSingle);
router.post("/", isAuthenticated, saveProduct, productController.createProduct);
router.put("/:id", isAuthenticated, saveProduct, productController.updateProduct);
router.delete("/:id", isAuthenticated, productController.deleteProduct);

module.exports = router;
