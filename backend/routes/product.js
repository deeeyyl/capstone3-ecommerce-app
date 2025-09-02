const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { verify, verifyAdmin, upload } = require("../auth");

// Create product - Admin Access only

router.post("/", verify, verifyAdmin, upload.single('image'), productController.createProduct);

// Get all product - Admin only

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Public Access - Get all active products

router.get("/active", productController.getAllActiveProducts);

// get all categories
router.get("/categories", productController.getCategories); 

// get product by category
router.get("/category/:category", productController.getProductsByCategory);

// get product brand

router.get("/brands", productController.getBrands);

// Sale

router.get('/sale', productController.getSaleProducts);

// get product by specific brand

router.get("/brand/:brand", productController.getProductsByBrand);

// retrieve - specific product

router.get("/:productId", productController.getProductById);

// update product

router.patch('/:productId/update', verify, verifyAdmin, productController.updateProduct);

// archive product

router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// activate product

router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);

// Search products by name
router.post("/search-by-name",  productController.searchByName);

// Search products by price range
router.post("/search-by-price",  productController.searchByPrice);

// Delete a product
router.delete('/:productId', verify, verifyAdmin, productController.deleteProduct);

// update sale admin

router.patch('/:productId/sale', verify, verifyAdmin, productController.updateSale);


module.exports = router;