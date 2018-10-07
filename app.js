"use strict";

var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

var users = [];

var lastId = -1;

// parse application/json
app.use(bodyParser.json());

function init() {
  fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
    users = JSON.parse(data);

    lastId = users.length;
  });
}

init();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/users', function(req, res) {
  res.setHeader('Content-Type', 'application/json')

  res.end(JSON.stringify(users));
});

app.get('/api/users/:id', function(req, res) {
  // First read existing users.
  var user = users[+req.params.id - 1]
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user));
});


app.post('/api/users', function(req, res) {

  let user = req.body;
  user.id = ++lastId
  users.push(user);

  // res.end(JSON.stringify(data, null, 2));
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user));
});

app.put('/api/users/:id', function(req, res) {
  // First read existing user
  let victim = users[+req.params.id - 1]

  let inputUser = req.body;

  victim.name=inputUser.name;
  victim.username=inputUser.username;
  victim.email = inputUser.email;

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(victim));
});

app.delete('/api/users/:id', function(req, res) {
  console.log(`pre: id=${req.params.id}`);

  let oldLength = users.length;

    let index = Number(req.params.id)-1;

    users.splice(index, 1);

    console.log(`post: users.length=${users.length}`);

    // check for error
    if(!(users.length === oldLength-1)) { //error
      throw new Error("AssertionError");
    }
    res.end();
});

var server = app.listen(8081, function() {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
