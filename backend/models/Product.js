const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  category: { type: String, default: "General" },
  brand: { type: String, required: true },
  imageFilename: { type: String, default: "" },
  sale: {
    isOnSale: { type: Boolean, default: false },
    salePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function(value) {
          return !this.sale.isOnSale || value < this.price;
        },
        message: "Sale price must be lower than original price"
      }
    },
    saleEndDate: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);