const validator = require("../helpers/validatorHelper");

const saveUser = (req, res, next) => {
  const validationRule = {
    github_id: "required|string",
    name: "required|string|min:3|max:50",
    email: "required|email",
    role: "required|string|in:admin,customer,employee",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveProduct = (req, res, next) => {
  const validationRule = {
    name: "required|string|min:3|max:100",
    description: "string|max:500",
    price: "required|numeric|min:0",
    stock: "required|integer|min:0",
    is_public: "required|boolean",
    active: "required|boolean",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveOrder = (req, res, next) => {
  const validationRule = {
    user_id: "required|string",
    codigo: "required|string|min:5|max:20",
    products: "required|array|min:1",
    "products.*.product_id": "required|string",
    "products.*.name": "required|string|min:2|max:100",
    "products.*.price_at_purchase": "required|numeric|min:0.01",
    "products.*.quantity": "required|integer|min:1",
    total: "required|numeric|min:0.01",
    status: "required|string|in:pending,paid,cancelled",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveReview = (req, res, next) => {
  const validationRule = {
    product_id: "required|string",
    user_id: "required|string",
    reviewerName: "required|string|min:3|max:50",
    score: "required|integer|min:1|max:5",
    comment: "string|max:500",
    reviewDate: "required|string",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveUser,
  saveProduct,
  saveOrder,
  saveReview,
};
