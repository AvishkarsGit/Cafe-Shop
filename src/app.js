const express = require("express");
const dotenv = require("dotenv");
const DB = require("./database/db.connect");
const Redis = require("./utils/Redis");
const app = express();

// config dotenv
dotenv.config();

// port
const port = process.env.PORT || 4000;

// connect database
DB.dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log(`Database connected`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// connect to redis
Redis.connectToRedis()
  .then(() => {
    console.log("connected to redis");
  })
  .catch((err) => {
    console.log("redis client error ", err);
  });

// DB.test()
//   .then(() => {
//     console.log();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
