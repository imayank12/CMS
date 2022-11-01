"use strict";
//command to set node environment variable
//$env:NODE_ENV = 'production'
const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const config = require("config");
const port = config.get("port");
const colors = require("colors");
const figlet = require("figlet");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use(
  express.json({
    extended: false,
  })
);

//route files
const appRoutes = require("./routes/index");

//mount router
app.use("/api/v1", appRoutes);



const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`.blue.bold);
  figlet.text("CMS", function (err, data) {
    if (err) {
      console.dir(err);
      return;
    }
    console.log(data.rainbow.bold);
  });
});

module.exports = server;
