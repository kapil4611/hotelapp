require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");

const bodyParsser = require("body-parser");
app.use(bodyParsser.json());

const PORT = process.env.PORT || 2000;

app.get("/", (req, res) => {
    res.send("Welcome to our Hotel");
});

// Import the rouuter files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuItemRoutes");

// Use the routers
app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
    console.log(`Server started and listening at port: ${PORT}`);
});