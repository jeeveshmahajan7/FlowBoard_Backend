const { validationResult } = require("express-validator");

// Middleware that checks validation results from express-validator
// and prevents the controller from running if input is invalid
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
