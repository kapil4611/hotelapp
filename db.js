// db.js build connectionn between nodejs server and mongodb database server
const mongoose = require("mongoose");
// require("dotenv").config();

// const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to mongodb server");
});

db.on('error', (err) => {
    console.log("Mongodb connection error: ", err);
});

db.on('disconnected', () => {
    console.log("Mongodb disconnected");
});

module.exports = db;