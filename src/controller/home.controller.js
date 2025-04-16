const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary.js");
const { Category } = require("../models/category.model");
const Product = require("../models/products.model.js");
const Cart = require("../models/cart.model.js");
const { Table } = require("../models/table.model.js");
const { Booking } = require("../models/booking.model.js");
const JWT = require("../utils/jwt.js");
const NodeMailer = require("../utils/NodeMailer.js");
const { Order } = require("../models/order.model.js");
const { listenerCount } = require("../models/query.model.js");

class HomeController {
  static getOrders = (req, res) => {
    res.render("users/orders.ejs");
  };
  static getCart = async (req, res) => {
    try {
      const userId = req.user._id;

      const items = await Cart.find({ userId }).populate("productId");
      let cartItems = [];

      if (!items) {
        return res.json({ success: false, message: "No items in the cart" });
      }

      for (let item of items) {
        // Clone product object and append quantity
        let productWithQuantity = {
          ...item.productId._doc,
          quantity: item.quantity,
        };
        cartItems.push(productWithQuantity);
      }

      res.render("users/cart.ejs", { cartItems });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
  static getProfile = async (req, res) => {
    const id = req.user._id;
    const user = await User.findOne({ _id: id });
    res.render("users/profile.ejs", { user });
  };

  static getProfileEditScreen = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    res.render("users/profile-edit.ejs", { user });
  };

  static changeProfile = async (req, res) => {
    try {
      const { name, phone } = req.body;

      const user = await User.findOne({ _id: req.params.id });

      if (!user) {
        throw new Error("user not found!!");
      }

      let profileUrl = user.profile;
      let cloudinaryId = user.cloudinaryId;

      if (req.file) {
        if (cloudinaryId) {
          await cloudinary.uploader.destroy(cloudinaryId);
        }

        console.log(req.file);

        profileUrl = req.file.path;
        cloudinaryId = req.file.filename;
      }

      const updated = await User.findOneAndUpdate(
        {
          name: name,
        },
        {
          name,
          phone,
          profile: profileUrl,
          cloudinaryId,
        },
        {
          new: true,
        }
      );

      console.log(updated);

      return res.json({
        success: true,
        message: "Profile updated successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getHomePage = async (req, res) => {
    try {
      const categories = await Category.find();

      const productsByCategory = await Product.aggregate([
        {
          $group: {
            _id: "$category", // Group by category
            products: { $push: "$$ROOT" }, // Collect all products in an array
          },
        },
        {
          $project: {
            _id: 1,
            products: { $slice: ["$products", 2] }, // Take only 2 products per category
          },
        },
      ]);

      res.render("auth/home.ejs", { categories, productsByCategory });
    } catch (error) {
      console.log(error);
    }
  };

  static getBookingPage = async (req, res) => {
    try {
      res.render("users/booking.ejs");
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  static getAdminBooking = async (req, res) => {
    try {
      res.render("users/admin_booking.ejs");
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  static addTable = async (req, res) => {
    try {
      const { tableNumber } = req.body;

      const isAssigned = await Table.findOne({ tableNumber });

      if (isAssigned) {
        return res.json({
          success: false,
          message: "This number is already assigned",
        });
      }

      const tableData = {
        tableNumber,
        tableCode: JWT.generateOTP(),
        isBooked: false,
      };

      const table = await new Table(tableData).save();

      if (!table) {
        throw new Error("failed to adding table");
      }

      return res.json({
        success: true,
        message: "Table added successfully...",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getTable = async (req, res) => {
    try {
      const { tableCode } = req.body;

      const tables = await Table.find().sort({ tableNumber: 1 }); //find all tables

      if (!tables) {
        return res.json({ success: false, message: "No tables are in cafe" });
      }

      const selectedTable = await Table.findOne({ tableCode });

      if (!selectedTable) {
        return res.json({
          success: false,
          message: "Table code does not match",
        });
      }

      return res.json({
        success: true,
        tables,
        selectedTable,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getTableBookingPage = async (req, res) => {
    try {
      const tables = await Table.find({}).sort({ tableNumber: 1 });
      if (!tables) {
        return res.json({
          success: false,
          message: "Tables not found",
        });
      }
      res.render("users/book_table.ejs", { tables });
    } catch (error) {
      console.log(error);
    }
  };

  static bookedTable = async (req, res) => {
    try {
      let selectedTables = req.body.selectedTables;

      const userId = req.user._id;

      selectedTables.forEach(async (selectedTable) => {
        const table = await Table.findOneAndUpdate(
          { _id: selectedTable },
          {
            isBooked: true,
          },
          {
            new: true,
          }
        );
      });

      // get users email

      const user = await User.findOne({ _id: userId });

      //generate booking code
      let bookingCode = JWT.generateBookingCode();

      // 3. Create a booking document
      const booking = await Booking.create({
        userId,
        tableIds: selectedTables,
        bookingCode,
      });

      await NodeMailer.sendBookingEmail(
        user.email,
        user.name,
        bookingCode,
        "Table Booking Code"
      );

      return res.json({
        success: true,
        message: "Table booked successfully...",
        sub_message: "we've sent booking code to your email",
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  static placeOrder = async (req, res) => {
    try {
      const userId = req.user._id;

      // check if table is booked or not

      const { tableCode, bookingCode } = req.body;

      // 1) if table code is incoming, then table is not booked.
      if (tableCode) {
        //find the table using table code
        const table = await Table.findOne({ tableCode });

        // place the order

        const cartItems = await Cart.find({ userId });

        let productIds = [];

        let totalPrice = 0;

        cartItems.forEach((item) => {
          productIds.push(item.productId);
          totalPrice = totalPrice + item.updatedPrice;
        });

        const ordersData = {
          userId,
          tableIds: table._id,
          products: productIds,
          totalPrice,
        };

        const order = await new Order(ordersData).save();

        await Table.findOneAndUpdate({ tableCode }, { isBooked: true });

        await Cart.deleteMany({ userId });

        return res.json({
          success: true,
          message: "Order placed successfully",
          order,
        });
      } else if (bookingCode) {
        // 2) if booking code is incoming, then table is booked.
        const bookings = await Booking.find({ userId, bookingCode });

        if (!bookings) {
          return res.json({ success: false, message: "Booking not found" });
        }

        let tableIds = [];
        bookings.forEach((book) => {
          tableIds.push(...book.tableIds);
        });

        const cartItems = await Cart.find({ userId });

        let productIds = [];

        let totalPrice = 0;

        cartItems.forEach((item) => {
          productIds.push(item.productId);
          totalPrice = totalPrice + item.updatedPrice;
        });

        const ordersData = {
          userId,
          tableIds,
          products: productIds,
          totalPrice,
        };

        await Cart.deleteMany({ userId });

        const order = await new Order(ordersData).save();
        return res.json({
          success: true,
          message: "Order placed successfully",
          order,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getBookedTable = async (req, res) => {
    try {
      const userId = req.user._id;
      const { bookingCode } = req.body;

      const bookings = await Booking.find({ userId, bookingCode });
      if (!bookings || bookings.length === 0) {
        return res.json({
          success: false,
          message: "Booking not found",
        });
      }

      let tables = [];

      for (const booking of bookings) {
        const tablesData = await Table.find({ _id: { $in: booking.tableIds } });
        tables.push(...tablesData);
      }

      console.log(tables);

      return res.json({
        success: true,
        tables,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
}
module.exports = HomeController;
