require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile.emails[0].value);
      // return cb(null, profile);
      User.findOne({ googleID: profile.id }, function (err, user) {
        if (!user) {
          console.log("No user found");
          const user = new User({
            googleID: profile.id,
          });
          user.save((err) => {
            if (!err) {
              console.log("New user saved to database");
              console.log(user);
              return cb(err, user);
            } else {
              console.log(err);
            }
          });
        } else {
          return cb(err, user);
        }
        // return cb(err, user);
      });
    }
  )
);

// Login Config
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      console.log("Allright");
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// database connection
mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database is connected");
});

// Schema, Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleID: String,
});
userSchema.methods.validPassword = function (pwd) {
  // EXAMPLE CODE!
  return this.password === md5(pwd);
};

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (!err) {
      res.render("secrets.ejs");
    } else {
      console.log(err);
    }
  });
});

app.get("/secrets", (req, res) => {
  // console.log(req.isAuthenticated());
  // // console.log(req);
  // // console.log("Hello World");
  // res.render("secrets");
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// Google Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("Success");
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("App is listening in 3000...");
});
