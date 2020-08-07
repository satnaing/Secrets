// require("dotenv").config();
// const express = require("express");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

// const app = express();

// app.use(express.urlencoded({ extended: true }));

// app.use(express.static("public"));

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// app.set("view engine", "ejs");

// // database connection
// mongoose.connect("mongodb://localhost:27017/secretsDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.set("useCreateIndex", true);

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("Database is connected");
// });

// // Schema, Model
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

// userSchema.plugin(passportLocalMongoose);

// const User = mongoose.model("User", userSchema);

// // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.use(User.createStrategy());

// // use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.render("home");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

// app.get("/secrets", (req, res) => {
//   console.log(req.isAuthenticated());
//   if (req.isAuthenticated()) {
//     console.log("Rendering to secrets");
//     res.render("secrets");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/register", (req, res) => {
//   console.log(req.body.username);
//   User.register({ username: req.body.username }, req.body.password, (err, user) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/login");
//     } else {
//       passport.authenticate("local")(req, res, () => {
//         console.log("Redirected to /secrets");
//         res.redirect("/secrets");
//       });
//     }
//   });
// });

// app.post("/login", (req, res) => {});

// app.listen(3000, () => {
//   console.log("App is listening in 3000...");
// });
