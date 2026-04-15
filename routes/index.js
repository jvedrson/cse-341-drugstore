const express = require("express");
const router = express.Router();
const passport = require('passport');

const userRouter = require("./userRoutes");
const productRouter = require("./productRoutes");
const ordersRouter = require("./ordersRouter")

router.get("/", (req, res) => {
  // #swagger.ignore = true;
  res.json({ message: "Welcome to the Drugstore API!" });
});
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/orders", ordersRouter)

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
