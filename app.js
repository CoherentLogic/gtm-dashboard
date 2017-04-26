var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('HELLO!');
});

app.listen(3000, () => {
    console.log("Dashboard started.");
});