const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgres://iafmohpqfmeesh:071fd2e24029e1ee52df07bd3d97462d01365fbe8ba6d3e82bdbc009d2920e1e@ec2-176-34-184-174.eu-west-1.compute.amazonaws.com:5432/dc5pac9fckspjv';
const client = new Client({
  connectionString: dbUrl,
  ssl: true,
});

var Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise,
});
pgp.pg.defaults.ssl = true;
var db = pgp(dbUrl);

/*
console.log('process.env.DATABASE_URL: ' + process.env.DATABASE_URL);
console.log('dbUrl: ' + dbUrl);
*/

client.connect();

let port = process.env.PORT;
if(port == null || port == "") {
  port = 8000;
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/timeline.html'));
});

app.get('/upload', function(req, res) {
  res.sendFile(path.join(__dirname + '/upload.html'));
});

app.get('/search', function(req, res) {
  let query = "SELECT image, time, isera FROM items ORDER BY time";

  db.any(query, [true])
    .then(function(data) {
      res.send(JSON.stringify(data));
      console.log(data);
    })
    .catch(function(err) {
      console.error(err);
    });
});

app.post('/upload', (req, res) => {
  var errors = [];
  var image = req.body.image;
  var contributor = toTitleCase(req.body.contributor);
  var time = req.body.time;
  var keywords = req.body.keywords;
  var description = req.body.description;
  var isEra = false;

  console.log('Image: ', image);
  if(image == null || image == '') {
    errors.push('Image is a compulsory field.');
  }

  if(time == null || time == '') {
    errors.push('Time period is a compulsory field.');
  }

  if(!image.includes('png') && !image.includes('jpeg') && !image.includes('jpg')) {
    errors.push('Image link must end with ".png", ".jpeg", or ".jpg".');
  }

  if(!validate(contributor)) {
    errors.push('Contributor can\'t contain special characters.');
  }

  if(!validate(time)) {
    errors.push('Time period can\'t contain special characters.');
  }

  if(time[time.length - 1] == 's') {
    isEra = true;
  }
  time = parseInt(time, 10);

  if(!validate(keywords, true)) {
    errors.push('Keywords can\'t contain special characters aside from commas (,).');
  }

  keywords = keywords.replace(' ,', ',');
  keywords = keywords.replace(', ', ',');
  keywords = keywords.replace(' , ', ',');
  keywords = keywords.toLowerCase();

  let query = "INSERT INTO items (image, contributor, time, keywords, description, isera) VALUES ('" + image + "','" + contributor + "','" + time + "','" + keywords + "','" + description + "'," + isEra + ")";

  if(errors.length == 0) {
    db.none(query, [true])
      .then(function(data) {
        console.log(JSON.stringify(data));
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  res.send(errors);
  res.end();
});

function validate(input, isKeywords) {
  if(isKeywords) {
    input = input.replace(',','');
  }
  var regex = /^[A-Za-z0-9 ]+$/
  var isValid = regex.test(input);
  return isValid;
}

app.listen(port);

function toTitleCase(str) {
  str = str.toLowerCase();
  return str.replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
  });
}
