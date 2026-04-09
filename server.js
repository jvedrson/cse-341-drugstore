const express = require("express");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger-output.json");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

const mongoDB = require("./db/database");

app.use(express.json());
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }),
);
app.use("/", require("./routes"));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoDB.initDatabase((err) => {
  if (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Database is listening and node Running on port ${port}`);
  });
});
