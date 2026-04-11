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
    price: "required|strict_numeric|min:0",
    stock: "required|strict_integer|min:0",
    is_public: "required|strict_boolean",
    active: "required|strict_boolean"
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
  saveProduct
};
