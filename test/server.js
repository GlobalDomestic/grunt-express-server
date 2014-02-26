'use strict';

var app = require('./app');
var server = module.exports = app.listen(app.get('port'), function() {
  console.log('ExpressJS app listening on port %s', app.get('port'));
});

server.on('close', function() {
  console.log('I am closed.');
});