const express = require('express');
const path = require('path');
const app = express();

let port = process.env.PORT;
if(port == null || port == "") {
  port = 8000;
}

app.listen(port);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/upload.html'));
});
