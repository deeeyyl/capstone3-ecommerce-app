
// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

require("dotenv").config();

// [SECTION] Server Setup
const app = express();
// To parse json data.
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:8000'],
  credentials: true, 
  optionsSuccessStatus: 200,
}

app.use(cors());


mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes)
app.use('/uploads', express.static('uploads'));

if(require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 3000}`)
  })
}
module.exports = { app, mongoose };
