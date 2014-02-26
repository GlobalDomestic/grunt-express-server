'use strict';

var grunt = require('grunt');
var request = require('request');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.not_connected = {
  test_server_not_running: function(test) {
    test.expect(1);

    request({
      url: 'http://localhost:3000/',
      method: 'GET'
    }, function (err, resp, body) {
      if (err) {
        test.equals('ECONNREFUSED', err.code);
      }
      test.done();
    });
  }
};
