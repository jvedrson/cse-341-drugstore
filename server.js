const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const port = process.env.PORT || 8080;

const mongoDB = require("./db/database");

app.use(express.json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// TODO: Add routes for roles, users, products, and orders
// app.use("/roles", require("./routes/roles"));
// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/orders", require("./routes/orders"));

mongoDB.initDatabase((err) => {
  if (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Database is listening and node Running on port ${port}`);
  });
});
