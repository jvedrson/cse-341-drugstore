const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");

router.use('/', require('./swagger'));
router.get("/", (req, res) => {
  // #swagger.ignore = true;
  res.json({ message: "Welcome to the Drugstore API!" });
});
router.use("/users", userRouter);

module.exports = router;
