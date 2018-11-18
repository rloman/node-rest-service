"use strict";

// create connection with mysql
const mysql = require('mysql');

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

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodetestuser',
  password: 'nodetestpass2018Spectrum',
  database: 'nodetest'
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected!');
  }
});

app.post('/api/users', function(req, res) {

  let user = req.body;

  connection.query('INSERT INTO users SET ?', user, (err, result) => {
    if (!err) {
      // res.end(JSON.stringify(data, null, 2));
      res.setHeader('Content-Type', 'application/json')
      // rloman temp
      user.id = result.insertId;
      res.end(JSON.stringify(user)); // rloman dit nog ophalen en test via select ...
    } else {
      throw err;
    }
  });
});

app.get('/api/users', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  connection.query('SELECT * FROM users', (err, users) => {
    if (!err) {
      res.end(JSON.stringify(users));
    } else {
      throw err;
    }
  });
});

app.get('/api/users/:id', function(req, res) {

  let id = +req.params.id
  connection.query('SELECT * FROM users where id=?', [id], (err, user) => {
    if (!err) {
      console.log('Data received from Db:\n');
      console.log(user);

      if (user) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(user));
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.end(); // rloman send 404???
      }
    } else {
      throw err;
    }
  });
});

app.put('/api/users/:id', function(req, res) {

        // First read id from params
        let id = +req.params.id
        let inputUser = req.body;

        console.log("Received username: "+inputUser.name);
        console.log("Received email: "+inputUser.email);

        connection.query(
          'UPDATE users SET name=?, username=?, email = ? Where ID = ?',
          [inputUser.name, inputUser.username, inputUser.email, id],
          (err, result) => {
            if (!err) {
              console.log(`Changed ${result.changedRows} row(s)`);

              // end of the update => send response

              connection.query('SELECT * FROM users where id=?', [id], (err, user) => {
                if (!err) {
                  console.log('Data received from Db:\n');
                  console.log(user);

                  if (user) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(user));
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(); // rloman send 404???
                  }
                } else {
                  throw err;
                }
              });
            }
            else {
              throw err;
            }
      });
});

app.delete('/api/users/:id', function(req, res) {
  let id = +req.params.id;

  connection.query(
    'DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (!err) {
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.end();
      }
      else {
        throw err;
      }
    }
  );
});

// and finally ... run it :-)
var server = app.listen(8081, function() {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});
