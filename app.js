var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/users', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
         res.setHeader('Content-Type', 'application/json')
       res.end( data );
   });
});

app.get('/api/users/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id] 
      res.setHeader('Content-Type', 'application/json')
      res.end( JSON.stringify(user));
   });
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
