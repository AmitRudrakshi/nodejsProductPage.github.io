const product = require('../models/productModel');
const jwt = require('jsonwebtoken');

// Get all products
exports.getAllProducts = (req, res) => {
  const token=req.headers.authorization;
  if(!token)
    {
      res.status(200).json({success:false, message: "Error!Token was not provided."});
    }
    //Decoding the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  product.find({})
    .then(products => {
      finalProducts=[];
      for(p in products)//p is index of product
        if(products[p].productUser==decodedToken.email)
          finalProducts.push(products[p]);
      res.json(finalProducts);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error retrieving products' });
    });
};

// Get a specific product by ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  product.findById(productId, (err, product) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving product' });
    } else if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  });
};

// Add a new product
exports.addProduct = (req, res) => {
  const token= req.body.userToken;
  if(!token)
    {
      res.status(200).json({success:false, message: "Error!Token was not provided."});
    }
  //Decoding the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const newProduct = new product({
    productName: req.body.productName,
    description: req.body.description,
    amount: req.body.amount,
    productUser: decodedToken.email,
  });
  newProduct.save()
    .then(savedProduct => {
      res.status(200).json(savedProduct);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

// Update an existing product
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const updatedProduct = {
    productName: req.body.productName,
    description: req.body.description,
    amount: req.body.amount,
  };
  product.findByIdAndUpdate(productId, updatedProduct, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json(updatedProduct);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error updating product' });
    });
};

// Delete a product
exports.deleteProduct = (req, res) => {
  const productId = req.params._id;
  product.findByIdAndRemove(productId)
    .then(deletedProduct => {
      if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.sendStatus(204);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error deleting product' });
    });
};
