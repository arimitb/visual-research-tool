const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

console.log('process.env.DATABASE_URL: ' + process.env.DATABASE_URL);

client.connect();

let port = process.env.PORT;
if(port == null || port == "") {
  port = 8000;
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/timeline.html'));
});

app.get('/upload', function(req, res) {
  res.sendFile(path.join(__dirname + '/upload.html'));
});

app.post('/upload', (req, res) => {
  const image = req.body.image;
  const contributor = req.body.contributor;
  const time = req.body.time;
  const keywords = req.body.keywords;
  const description = req.body.description;
  var query = "INSERT INTO items (image, contributor, time, keywords, description) VALUES ('" + image + "','" + contributor + "','" + time + "','" + keywords + "','" + description + "')";
  client.query(query, function(err, res) {
    if(err) throw err;
    for(let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });
  res.end();
});

app.listen(port);
