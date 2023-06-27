const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  description: String,
  amount: String,
  productUser: String,
});

module.exports = mongoose.model('product', productSchema);
