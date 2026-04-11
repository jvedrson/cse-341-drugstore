const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const productRouter = require("./productRoutes");

router.use('/', require('./swagger'));
router.get("/", (req, res) => {
  // #swagger.ignore = true;
  res.json({ message: "Welcome to the Drugstore API!" });
});
router.use("/users", userRouter);
router.use("/products", productRouter);

module.exports = router;
