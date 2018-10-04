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
    this.users = JSON.parse(data);
    // console.log(this.users);
    // console.log(typeof(this.users));
    this.lastId = this.users.length;

  });
}

init();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/users', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  console.log(this.users);
  res.end(JSON.stringify(this.users));
});

app.get('/api/users/:id', function(req, res) {
  // First read existing users.
  var user = this.users[+req.params.id - 1]
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user));
});


app.post('/api/users', function(req, res) {

  let user = req.body;
  user.id = ++this.lastId
  this.users.push(user);

  // res.end(JSON.stringify(data, null, 2));
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user));
});

app.delete('/api/users/:id', function(req, res) {
  console.log(`pre: id=${req.params.id}`);

  let oldLength = this.users.length;

    let index = Number(req.params.id)-1;

    this.users.splice(index, 1);

    console.log(`post: users.length=${this.users.length}`);

    // check for error
    if(!(this.users.length === oldLength-1)) { //error
      throw new Error("AssertionError");
    }
    res.end();
});

var server = app.listen(8081, function() {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
