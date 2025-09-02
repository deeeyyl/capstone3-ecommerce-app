const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

// Get All Users - Admin
router.get("/", verify, verifyAdmin, userController.getAllUsers);

// Registration - Krisha
router.post("/register", userController.registerUser);

// Log-in Krisha
router.post("/login", userController.loginUser);

// Retrieve User Dale
router.get("/details", verify, userController.retrieveUser);

// Set As Admin Dale
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

// Update Password Dale

router.patch("/update-password", verify, userController.updatePassword);

// Like product
router.post("/like/:productId", verify, userController.likeProduct);

// Unlike Product
router.post("/unlike/:productId", verify, userController.unlikeProduct);

// Get my likes
router.get("/my-likes", verify, userController.getLikedProducts);


module.exports = router;