const { createClient } = require("redis");
require("dotenv").config();

class Redis {
  static client = createClient({
    url:'redis://'+process.env.REDIS_SERVER_HOST+':'+process.env.REDIS_SERVER_PORT,
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
    let options;
    if (expires_at) {
      options = {
        EX: expires_at,
      };
    }
    await this.client.set(key, value, options);
  }

  static async getVal(key) {
    const value = await this.client.get(key);
    return value;
  }

  static async delKey(key) {
    await this.client.del(key);
  }
}

module.exports = Redis;
