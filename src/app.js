const express = require("express");
const dotenv = require("dotenv");
const DB = require("./database/db.connect");
const Redis = require("./utils/Redis");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

// config dotenv
dotenv.config();

// port
const port = process.env.PORT || 4000;

// import router
const userRouter = require("./routes/auth.routes");
const homeRouter = require("./routes/home.routes");

// config important
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

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

// routes
app.use("/auth", userRouter);
app.use("/", homeRouter);
