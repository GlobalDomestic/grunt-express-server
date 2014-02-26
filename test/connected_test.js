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

exports.connected = {
  tests_running_in_development: function(test) {
    test.expect(2);

    request({
      url: 'http://localhost:3000/env',
      method: 'GET'
    }, function (err, resp, body) {
      if (resp) {
        test.equal(resp.statusCode, 200, 'should return 200');
        test.equal(body, 'Howdy from development!', 'should return dynamic page');
      }
      test.done();
    });
  }
};
