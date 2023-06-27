const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Joi = require('joi');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { validateLogIn } = require('../middleware/validation');
passport.use(new LocalStrategy(User.authenticate()));

async function logIn(req, res) {
  try{
  email = req.body.email;
  loginPassword=req.body.password;

  const user= await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ error: 'Cannot find User' });
    }

    const pass= await bcrypt.compare(loginPassword, user.password);
    if (pass) {
      const token = await generateToken(user);
      res.status(201).json({ token });
    }
    else{
      return res.status(409).json({ error: 'Password does\'nt match.' });
    }
}
catch(error) {
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
  logIn,
};
