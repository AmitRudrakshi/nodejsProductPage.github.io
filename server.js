const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


//cors is used to include appropriate CORS headers
app.use(cors());


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/productPageProjectDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Handle connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const productSchema = new mongoose.Schema({
  productName: String,
  description: String,
  amount: String,
});

const product = mongoose.model('product', productSchema);



// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



let products = [];
// Get all products
app.get('/api/products', (req, res) => {
  product.find({})
    .then(products => {
      res.json(products);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error retrieving products' });
    });
});


// Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
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
});


// Add a new product
app.post('/api/products', (req, res) => {
  const newProduct = new product({
    productName: req.body.productName,
    description: req.body.description,
    amount: req.body.amount,
  });
  newProduct.save()
    .then(saveProduct => {
      //Handle successful save
      res.status(200).json(saveProduct);
    })
    .catch(error => {
      //Handle save error
      res.status(500).json({ error:error.message });
    });
});


// Update an existing product
app.put('/api/products/:id', (req, res) => {
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

});


// Delete a product
app.delete('/api/products/:_id', (req, res) => {
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
});