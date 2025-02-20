class HomeController {
  static getOrders = (req, res) => {
    res.render("users/orders.ejs");
  };
  static getCart = (req, res) => {
    res.render("users/cart.ejs");
  };
  static getProfile = (req, res) => {
    res.render("users/profile.ejs");
  };
}
module.exports = HomeController;
