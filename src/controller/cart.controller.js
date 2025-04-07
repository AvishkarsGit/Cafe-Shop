const { TimeSeriesBucketTimestamp } = require("redis");
const Cart = require("../models/cart.model.js");
const Product = require("../models/products.model.js");

class CartController {
  static addToCart = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      // If product is not in cart, create new entry
      await new Cart({
        userId,
        productId,
        quantity: 1,
        updatedPrice: product.ProductPrice,
      }).save();

      const count = await Cart.find({ userId }).countDocuments();

      await Product.updateOne(
        {
          _id: productId,
        },
        {
          $set: { updatedProductPrice: product.ProductPrice },
        }
      );

      return res.json({
        success: true,
        message: "Added to cart",
        count,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  static fetchCart = async (req, res) => {
    try {
      const userId = req.user ? req.user._id : null;

      if (!userId) {
        console.log("no user found");
        return res.json({ success: false, message: "User not logged in" });
      }

      const cartItems = await Cart.find({ userId }).populate("productId");

      if (!cartItems || cartItems.length === 0) {
        return res.json({ success: false, message: "No items in the cart" });
      }

      const cartData = cartItems.map((item) => ({
        productId: item.productId?._id?.toString(),
        quantity: item.quantity,
      }));

      return res.json({
        success: true,
        cartItems: cartData,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static addQty = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user.id; // Make sure req.user is set from auth middleware

      const cartItem = await Cart.findOneAndUpdate(
        { productId, userId },
        { $inc: { quantity: 1 } },
        { new: true }
      );

      if (!cartItem) {
        return res.json({
          success: false,
          message: "Cart item not found",
        });
      }

      const product = await Product.findOne({ _id: productId });

      const qty = cartItem.quantity;
      const price = product.ProductPrice;
      const updatedPrice = qty * price;

      await Cart.findOneAndUpdate(
        { productId, userId },
        { $set: { updatedPrice } }
      );

      await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { updatedProductPrice: updatedPrice } }
      );

      return res.json({
        success: true,
        quantity: cartItem.quantity,
        updatedPrice,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static minusQty = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user.id; // Ensure req.user is set

      let count;
      // Decrement quantity by 1 if greater than 1
      let cartItem = await Cart.findOneAndUpdate(
        { productId, userId, quantity: { $gt: 1 } }, // Ensures it doesn't go below 1
        { $inc: { quantity: -1 } },
        { new: true }
      );

      // If cartItem is null, check if the item exists with quantity 1
      if (!cartItem) {
        cartItem = await Cart.findOne({ productId, userId });

        if (cartItem && cartItem.quantity === 1) {
          // Remove item from the cart when quantity reaches 0
          await Cart.deleteOne({ productId, userId });
        }

        count = await Cart.find({ userId }).countDocuments();
        return res.json({
          success: false,
          message: "Cannot decrease quantity below 1",
          count,
        });
      }

      const product = await Product.findOne({ _id: productId });

      const qty = cartItem.quantity;
      const price = product.ProductPrice;
      const updatedPrice = qty * price;

      await Cart.findOneAndUpdate(
        { productId, userId },
        { $set: { updatedPrice } }
      );

      await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { updatedProductPrice: updatedPrice } }
      );

      return res.json({
        success: true,
        quantity: cartItem.quantity,
        count,
        updatedPrice,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getItemsCount = async (req, res) => {
    try {
      const userId = req.user._id;

      const count = await Cart.find({ userId }).countDocuments();

      if (count === 0) {
        return res.json({
          success: false,
        });
      } else {
        return res.json({
          success: true,
          count,
        });
      }
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
}

module.exports = CartController;
