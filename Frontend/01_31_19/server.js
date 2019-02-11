'use strict';

/*
 * A simple Node.js program for exporting the current working directory via a webserver listing
 * on a hard code (see portno below) port. To start the webserver run the command:
 *    node server.js
 * Make sure you have the npm package manager installed on your machine.
 * You'll need to have node installed on your machine, as well as express and angular. To install express, run:
 *
 * npm install express 
 * npm install angular
 */

/* jshint node: true */

var express = require('express');

var port = 8080;
var app = express();


// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get('/', function (request, response) {
  response.status(200).send('Welcome to MixedTape');
});


app.get('/test', function (request, response) {
  response.status(200).send("Hello World");
  return;
});
app.get('/info', function (request, response) {
  response.status(200).send("Hello World");
  return;
});



var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port);
});
