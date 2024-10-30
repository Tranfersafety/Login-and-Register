const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");

//Mongo db connection
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});
global.loggedIn = null;
//controller
const indexController = require("./controllers/indexController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const storeController = require("./controllers/storeUserController");
const loginUserController = require("./controllers/loginUserController");
const logoutController = require("./controllers/logoutController");
const redirectIfAuth = require("./middleware/redirectIfAuth");
const homeController = require("./controllers/homeController");
const authMiddleware = require("./middleware/authMiddleware");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
  })
);
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});
app.set("view engine", "ejs");

app.get("/", indexController);
app.get("/home", authMiddleware, homeController);
app.get("/login", redirectIfAuth, loginController);
app.get("/register", redirectIfAuth, registerController);
app.post("/user/register", redirectIfAuth, storeController);
app.post("/user/login", redirectIfAuth, loginUserController);
app.get("/logout", logoutController);

app.listen(4000, () => {
  console.log("app listen on port 4000");
});
