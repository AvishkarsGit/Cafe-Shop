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

      console.log("userId = ", userId);

      const product = await Product.findById(productId);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      // Check if item already exists in cart
      const existingCartItem = await Cart.findOne({ userId, productId });

      if (existingCartItem) {
        existingCartItem.quantity += 1; // Increment quantity
        await existingCartItem.save();
        return res.json({ success: true, message: "Cart updated" });
      }

      // If product is not in cart, create new entry
      const newItem = await new Cart({ userId, productId, quantity: 1 }).save();
      return res.json({
        success: true,
        message: "Added to cart",
        data: newItem,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
}

module.exports = CartController;
