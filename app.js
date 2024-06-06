const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8080;
const path = require("path");
// const SeedDB = require("./seed");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const engine = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerse")
  .then(() => {
    console.log(`db connected`);
  })
  .catch((err) => {
    console.log(err);
  });

let configSession = {
  secret: " randomString",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly : true,
    expires : Date.now() + 24*7*60*60*1000,
    maxAge :  24*7*60*60*1000
   },
};
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(configSession));
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // req.locals.error =  req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

// SeedDB();

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

const productRoutes = require("./routes/product");
// const seedDB = require('./seed');
app.use(productRoutes);

const reviewRoutes = require("./routes/review");
app.use(reviewRoutes);

const authRoutes = require("./routes/auth");
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`app is listening to port : ${PORT}`);
});
