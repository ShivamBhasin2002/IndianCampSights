const express = require('express');
const app = express();
const path = require('path');

app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) => {
    res.render("index");
})

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(process.env.PORT || 3000);
    console.log("Server Started");
})