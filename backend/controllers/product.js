const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// create product - Krisha

module.exports.createProduct = (req, res) => {
  const { name, description, price, stock } = req.body;

  // Validate required fields
  if (!name || !description || isNaN(price)) {
    return res.status(400).send({
      success: false,
      message: "All fields are required and must be valid",
    });
  }

  // Handle uploaded image
  const imageFilename = req.file ? req.file.filename : null;

  const newProduct = new Product({
    name,
    description,
    price: parseFloat(price),
    stock,
    imageFilename,
    isActive: true,
  });

  return newProduct
    .save()
    .then((result) => {
      console.log("FILE RECEIVED:", req.file);
      return res.status(201).send({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

// Retrieve all product

module.exports.getAllProducts = (req, res) => {
  Product.find() 
    .then((products) => {
      if (!products || products.length === 0) {
        return res.status(404).send({
          success: false,
          message: "No products found",
        });
      }

      return res.status(200).send(products);
    })
    .catch((error) => errorHandler(error, req, res));
};

// Get all active products

module.exports.getAllActiveProducts = (req, res) => {
  Product.find({ isActive: true })
    .then((products) => {
      if (!products || products.length === 0) {
        return res.status(404).send({
          success: false,
          message: "No active products found",
        });
      }

      return res.status(200).send(products);
    })
    .catch((error) => errorHandler(error, req, res));
};

//get all categories

module.exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

// Browse products by category
module.exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: "Category is required" 
      });
    }

    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") }, // case-insensitive
      isActive: true,
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No products found in category: ${category}` 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
// Get all brands (distinct)
module.exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand"); // 
    res.status(200).send({ success: true, data: brands });
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).send({ message: "Server error" });
  }
};

// Browse products by brand
module.exports.getProductsByBrand = (req, res) => {
  const brand = req.params.brand;

  Product.find({ brand: brand }) // <-- not findById
    .then(products => {
      if (!products || products.length === 0) {
        return res.status(404).send({ message: "No products found for this brand" });
      }
      return res.status(200).send(products);
    })
    .catch(err => {
      console.error("Error fetching products by brand:", err);
      return res.status(500).send({ error: "Server error" });
    });
};

// Retrieve Specific Product

module.exports.getProductById = (req, res) => {
  const productId = req.params.productId;

  if (!productId) {
    return res.status(400).send({
      success: false,
      message: "Product ID is required",
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).send(product);
    })
    .catch((error) => errorHandler(error, req, res));
};

// update product
module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unable to update product. User is not an admin." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// archive product

module.exports.archiveProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const archivedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!archivedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(archivedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to archive product", error: error.message });
  }
};



// Activate Product

module.exports.activateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const activatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: true },
      { new: true }
    );

    if (!activatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(activatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to activate product", error: error.message });
  }
};

//Search Products

// 1 - search by name
module.exports.searchByName = async (req, res) => {
  try {
    const { name } = req.body; // ⬅️ changed from req.query

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
      isActive: true,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ success: true, data: products });

  } catch (error) {
    return errorHandler(error, req, res);
  }
};
// 2- search by price

module.exports.searchByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    if (!minPrice && !maxPrice) {
      return res.status(400).json({ message: "Price range is required" });
    }

    const priceFilter = {};
    if (minPrice) priceFilter.$gte = parseFloat(minPrice);
    if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

    const products = await Product.find({
      price: priceFilter,
      isActive: true,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this price range" });
    }

    return res.status(200).json({ success: true, data: products });

  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: error.message
    });
  }
};

// get sale product

module.exports.getSaleProducts = async (req, res) => {
  console.log("getSaleProducts route hit");
  try {
    const saleProducts = await Product.find({ 'sale.isOnSale': true });
    res.status(200).json(saleProducts);
  } catch (error) {
    console.error("Error fetching sale products:", error);
    res.status(500).json({ message: 'Error fetching sale products', error });
  }
};



// update sale admin

module.exports.updateSale = async (req, res) => {
  const productId = req.params.productId;
  const { isOnSale, discountPercentage, saleStart, saleEnd } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!product.sale) {
      product.sale = {};
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({ message: "Discount percentage must be between 0 and 100" });
    }

    product.sale.isOnSale = isOnSale;
    product.sale.discountPercentage = discountPercentage;

    if (isOnSale && discountPercentage > 0) {
      product.sale.salePrice = product.price * (1 - discountPercentage / 100);
    } else {
      product.sale.salePrice = null;
    }

    product.sale.saleStart = saleStart ? new Date(saleStart) : null;
    product.sale.saleEnd = saleEnd ? new Date(saleEnd) : null;

    await product.save();

    res.status(200).json({ message: 'Sale updated', product });
  } catch (err) {
    console.error('Error updating sale:', err);
    res.status(500).json({ message: 'Error updating sale', error: err.message });
  }
};