"use strict";

var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

var games = [];

var lastId = -1;

// parse application/json
app.use(bodyParser.json());

function init() {
  fs.readFile(__dirname + "/" + "games.json", 'utf8', function(err, data) {
    games = JSON.parse(data);

    lastId = games.length;
  });
}

init();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function findById(id) {

 for(let game of games) {
    if (game.id === id) {

      return game;
    }
  }
}


function findIndexById(id) {
  for(let i = 0;i<games.length;i++) {
     if (games[i].id === id) {

       return i;
     }
   }
}


app.get('/api/games', function(req, res) {

  res.setHeader('Content-Type', 'application/json')

  res.end(JSON.stringify(games));
});

app.get('/api/games/:id', function(req, res) {

  let id = +req.params.id

  let game = findById(id);

  if(game) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(game));
  }
  else {
    res.setHeader('Content-Type', 'application/json')
    res.end(); // rloman send 404???
  }


});

app.get('/api/games/:id/players', function(req, res) {

  let id = +req.params.id

  let game = findById(id);

  let players = game.players;

  if(players) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(players));
  }
  else {
    res.setHeader('Content-Type', 'application/json')
    res.end(); // rloman send 404???
  }


});


app.post('/api/games', function(req, res) {

  let game = req.body;
  game.id = ++lastId
  games.push(game);

  // res.end(JSON.stringify(data, null, 2));
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(game));
});

app.post('/api/games/:id', function(req, res) {

  let player = req.body;

  let id = +req.params.id;

  let game = findById(id);

  game.players.push(player);

  // res.end(JSON.stringify(data, null, 2));
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(post));
});

app.put('/api/games/:id', function(req, res) {
  // First read existing game
  let id = +req.params.id;
  let victim = findById(id);

  let inputgame = req.body;

  victim.name=inputgame.name;
  victim.difficulty=inputgame.difficulty;
  victim.playtime = inputgame.playtime;

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(victim));
});

app.delete('/api/games/:id', function(req, res) {
  let oldLength = games.length;
  let id = +req.params.id;

  let victimIndex = findIndexById(id);

  games.splice(victimIndex, 1);

    console.log(`post: games.length=${games.length}`);

    // check for error
    if(!(games.length === oldLength-1)) { //error
      throw new Error("AssertionError");
    }
    res.end();
});

var server = app.listen(8081, function() {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening 2018-12-13 at http://%s:%s", host, port)

})
