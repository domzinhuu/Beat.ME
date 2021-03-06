const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 4200);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})

console.log('Game Start');