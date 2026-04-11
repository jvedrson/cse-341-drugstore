const Validator = require("validatorjs");

/*
==========================================================================
=>                       VALIDATION CUSTOM RULES
==========================================================================
*/

// validacion custom para booleanos estrictos (true/false, no strings)
Validator.register(
  "strict_boolean",
  (value) => typeof value === "boolean",
  "The :attribute field must be a boolean (true or false, not a string)."
)

// validacion custom para numeros enteros
Validator.register(
  "strict_integer",
  (value) => typeof value === "number" && Number.isInteger(value),
  "The :attribute field must be an integer, not a string."
);

// validacion custom para numeros decimales
Validator.register(
  "strict_numeric",
  (value) => typeof value === "number",
  "The :attribute field must be a number, not a string."
); 

/*
==========================================================================
==========================================================================
*/

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);

  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
