const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../src/database/db.connect");
const engine = require("ejs-mate");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

// Config dotenv
dotenv.config();

// importing routes
const userRouter = require("./routes/user.routes.js");
const homeRouter = require("./routes/home.routes.js");
const { AuthMiddleware } = require("./middleware/auth.middleware.js");

// configure some express imps
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(cookieParser());

// configuring server
const port = process.env.PORT || 4000;

// connect with local database, when database is connected, server will start.

connectDB()
  .then((res) => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
      console.log(`Database Connected!..`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

// configure routes

app.get("*", AuthMiddleware.checkUser);
app.use("/", homeRouter);
app.use("/user", userRouter);
