const Joi = require('joi');

// Validation middleware for sign-in route
function validateSignIn(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

// Validation middleware for log-in route
function validateLogIn(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

module.exports = {
  validateSignIn,
  validateLogIn,
};
