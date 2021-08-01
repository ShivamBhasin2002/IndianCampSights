const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/indian-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render("index");
})
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: "NewDelhi" });
    await camp.save();
    res.send(camp);
})

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(process.env.PORT || 3000);
    console.log("Server Started");
})