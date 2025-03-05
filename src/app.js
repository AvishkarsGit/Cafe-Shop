const express = require("express");
require("dotenv").config();
const DB = require("./database/db.connect.js");
const Redis = require("./utils/Redis.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const engine = require("ejs-mate");
const app = express();
const PORT = 4000;

//config port
const port = process.env.PORT || 4000;

// import router
const userRouter = require("./routes/auth.routes.js");
const homeRouter = require("./routes/home.routes.js");
const productRouter = require("./routes/product.routes.js");
const categoryRouter = require("./routes/category.routes.js");
const GlobalMiddleware = require("./middleware/global.middleware.js");

// config important
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// session options
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

// connect database
DB.dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
      console.log(`Database connected`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currUser = req.session.currUser || null;
  next();
});

// routes
app.use("/auth", userRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/", homeRouter);
