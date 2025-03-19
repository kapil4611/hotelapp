require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");

const passport = require("./auth");

const bodyParsser = require("body-parser");
app.use(bodyParsser.json());

const PORT = process.env.PORT || 2000;

// Middleware function (run after Request and before Response)
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
    next();
}

app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate("local", {session: false});

app.get("/", (req, res) => {
    res.send("Welcome to our Hotel");
});

// Import the rouuter files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuItemRoutes");

// Use the routers
app.use("/person", localAuthMiddleware, personRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
    console.log(`Server started and listening at port: ${PORT}`);
});