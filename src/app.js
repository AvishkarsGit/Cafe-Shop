const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./database/db.connect");
const app = express();

// config dotenv
dotenv.config();

// port
const port = process.env.PORT || 4000;

// connect database
dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log(`Database connected`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
