const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");
const { saveOrder } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get('/', orderController.getAll);
router.get('/:id', orderController.getSingle);
router.post("/", isAuthenticated, saveOrder,orderController.createOrder);
router.put("/:id", isAuthenticated, saveOrder, orderController.updateOrder);
router.delete("/:id", isAuthenticated, orderController.deleteOrder);

module.exports = router;