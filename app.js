var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

var users = [];

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       this.users = JSON.parse(data);
	console.log(this.users);
	console.log(typeof(this.users));
	next();
   });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/users', function (req, res) {
         res.setHeader('Content-Type', 'application/json')
         console.log(this.users);
         res.end( JSON.stringify(this.users) );
});

app.get('/api/users/:id', function (req, res) {
   // First read existing users.
      var user = this.users[+ req.params.id-1] 
      res.setHeader('Content-Type', 'application/json')
      res.end( JSON.stringify(user));
});


app.post('/api/users', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user9"] = req.body;
       console.log( data );

       // res.end(JSON.stringify(data, null, 2));
        res.setHeader('Content-Type', 'application/json')
       res.end( JSON.stringify(data));
   });
});

app.delete('/api/users/:id', function (req, res) {

   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
