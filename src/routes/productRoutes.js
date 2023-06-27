const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const signInController = require('../controllers/signInController');
const logInController = require('../controllers/logInController');
const { validateSignIn, validateLogIn } = require('../middleware/validation');


// Sign-in route
router.post('/signin', validateSignIn, signInController.signIn);

// Log-in route
router.post('/login', validateLogIn, logInController.logIn);

// Get all products
router.get('/', productController.getAllProducts);

// Get a specific product by ID
router.get('/:id', productController.getProductById);

// Add a new product
router.post('/', productController.addProduct);

// Update an existing product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:_id', productController.deleteProduct);

module.exports = router;
