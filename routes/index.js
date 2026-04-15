const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const productRouter = require("./productRoutes");
const reviewRouter = require("./reviewRoutes")

router.get("/", (req, res) => {
  // #swagger.ignore = true;
  res.json({ message: "Welcome to the Drugstore API!" });
});
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);

module.exports = router;
