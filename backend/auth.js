const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("./models/User");
require("dotenv").config();

// =====================
// JWT Helpers
// =====================
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// Verify User Token
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(401).send({ auth: "Failed", message: "No Token Provided" });
  } else {
    token = token.slice(7, token.length); // remove "Bearer "

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
      if (err) {
        return res.status(401).send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};

// Verify Admin User
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};

// =====================
// Multer Config (Image Upload)
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // make sure the /uploads folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, or PNG images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports.upload = upload;

// =====================
// Error Handler
// =====================
module.exports.errorHandler = (err, req, res, next) => {
  const errorMessage = err.message;
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null
    }
  });
};