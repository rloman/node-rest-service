"use strict";

// create connection with mysql
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodetestuser',
  password: 'nodetestpass2018Spectrum',
  database: 'nodetest'
});

connection.connect((err) => {
  if (err)  {
    throw err;
  }
  else {
      console.log('Connected!');
  }
});

// rest part
var express = require('express');
var app = express();
var fs = require("fs"); // rloman volgens mij kan deze nu weg
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


function findIndexById(id) {
  for(let i = 0;i<users.length;i++) {
     if (users[i].id === id) {

       return i;
     }
   }
}


app.get('/api/users', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  connection.query('SELECT * FROM users', (err, users) => {
    if (err){
      throw err;
    }
    else {
      res.end(JSON.stringify(users));
    }
  });
});

app.get('/api/users/:id', function(req, res) {

  let id = +req.params.id
  connection.query('SELECT * FROM users where id=?', [id], (err, user) => {
    if (err) throw err;

    console.log('Data received from Db:\n');
    console.log(user);

    if(user) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user));
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.end(); // rloman send 404???
    }
  });
});


app.post('/api/users', function(req, res) {

  let user = req.body;

  console.log(user);

  connection.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) throw err;

      // res.end(JSON.stringify(data, null, 2));
      res.setHeader('Content-Type', 'application/json')

      // rloman temp
      user.id = result.insertId;
      res.end(JSON.stringify(user)); // rloman dit nog ophalen en test via select ...
    });
});

app.put('/api/users/:id', function(req, res) {
  // First read existing user
  let id = +req.params.id;
  let victim = findById(id);

  let inputUser = req.body;

  victim.name=inputUser.name;
  victim.username=inputUser.username;
  victim.email = inputUser.email;

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(victim));
});

app.delete('/api/users/:id', function(req, res) {
  let oldLength = users.length;
  let id = +req.params.id;

  let victimIndex = findIndexById(id);

  users.splice(victimIndex, 1);

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
