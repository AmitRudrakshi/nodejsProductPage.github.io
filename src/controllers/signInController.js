const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');

async function signIn(req, res) {
  try {
    // Validate the request body
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user
    const user = new User({
      username: req.body.email,
      email: req.body.email,
      password: hashedPassword,
    });
    // Save the user to the database
    await user.save();
    // Generate a JWT token
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function generateToken(user) {
  // Generate a JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
}

module.exports = {
  signIn,
};
