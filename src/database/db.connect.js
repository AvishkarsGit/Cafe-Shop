const mongoose = require("mongoose");
const Redis = require("../utils/Redis");

class DB {
  static dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URL);
  };

  static test = async () => {
    await Redis.setValue("name", "avishkar");
    const value = await Redis.getVal("course");
    console.log(value);
  };
}

module.exports = DB;
