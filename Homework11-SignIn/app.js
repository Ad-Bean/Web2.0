const createError = require("http-errors");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const lessMiddleware = require("less-middleware");

const app = express();
const { routes } = require("./routes/routes");
const { error } = require("console");
const { authorized, isLogin } = require("./middleware/authorized");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static resource
app.use("/", express.static(path.join(__dirname, "public")));

// middlewares
app.use(
  lessMiddleware(__dirname + "/public/", {
    // debug: true,
    dest: __dirname + "/public/",
  })
);

app.use(
  session({
    secret: "liaoyuxuan18322043",
    resave: false,
    saveUninitialized: true,
    // cookie used for 1 day
    cookie: { path: "/", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 },
    store: new session.MemoryStore(),
  })
);

app.use(authorized);

// traverse route array to handle get or post request
routes
  .filter((route) => route.method === "GET")
  .forEach((route) =>
    app.get(route.path, async (req, res) => {
      try {
        await new route.controller(req, res)[route.action]();
      } catch (e) {
        error(e);
      }
    })
  );

routes
  .filter((route) => route.method === "POST")
  .forEach((route) =>
    app.post(route.path, async (req, res) => {
      try {
        await new route.controller(req, res)[route.action]();
      } catch (e) {
        error(e);
      }
    })
  );

// catch 404
app.use((req, res, next) => {
  res.status(404).render("404.pug");
});

module.exports = app;
