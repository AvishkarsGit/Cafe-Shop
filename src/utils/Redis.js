const { createClient } = require("redis");
require("dotenv").config();

class Redis {
  static client = createClient({
    url:
      "redis://" +
      process.env.REDIS_SERVER_HOST +
      ":" +
      process.env.REDIS_SERVER_PORT,
    username: process.env.redis_username,
    password: process.env.redis_password,
    // socket: {
    //   host: process.env.REDIS_SERVER_HOST?.trim(), // Ensure no spaces or quotes
    //   port: parseInt(process.env.REDIS_SERVER_PORT) || 6379, // Convert port to number
    // },
  });

  static async connectToRedis() {
    await this.client.connect();
  }

  static async setValue(key, value, expires_at) {
    try {
      let options;
      if (expires_at) {
        options = {
          EX: expires_at,
        };
      }
      await this.client.set(key, value, options);
      return;
    } catch (error) {
      console.log(error);
      throw "server not connected! please try again...";
    }
  }

  static async getVal(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.log(error);

      throw "server not connected! please try again..";
    }
  }

  static async delKey(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.log(error);

      throw "server not connected! please try again..";
    }
  }
}

module.exports = Redis;
