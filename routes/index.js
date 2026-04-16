const express = require("express");
const router = express.Router();
const passport = require("passport");

const userRouter = require("./userRoutes");
const productRouter = require("./productRoutes");
const ordersRouter = require("./ordersRouter");
const reviewRouter = require("./reviewRoutes");

router.get("/", (req, res) => {
  // #swagger.ignore = true;
  const user = req.session.user;
  if (user) {
    console.log("Authenticated user:", user);
    const userInfo = `Authenticated user: ${user.name} (ID: ${user.github_id})`;
    const welcomeMessage = `<h2>${userInfo}</h2><p>Go to <a href='/api-docs'>API documentation</a></p><p><a href='/logout'>Logout</a></p>`;
    res.send(welcomeMessage);
  } else {
    console.log("No authenticated user");
    res.send(
      "<h2>Welcome to the Drugstore API</h2><p>Log in with <a href='/login'>Github</a>.</p>",
    );
  }
});
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/orders", ordersRouter);

router.get("/login", passport.authenticate("github"), (req, res) => {
  // #swagger.ignore = true;
});

router.get("/logout", function (req, res, next) {
  // #swagger.ignore = true;
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
