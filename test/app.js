'use strict';

var express = require('express');
var util = require('util');
var app = module.exports = express();
var args = process.argv;

console.log( 'I am starting...');

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
});

app.get('/env', function(req, res) {
  res.send(util.format('Howdy from %s!', app.get('env')));
});

// Setup simple echo for each additional argument passed for testing
args.slice(2).forEach(function(arg) {
  app.get('/' + arg, function(req, res) {
    res.send(util.format('Howdy %s from %s!', arg, app.get('env')));
  });
});