// db.js build connectionn between nodejs server and mongodb database server
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB, {
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