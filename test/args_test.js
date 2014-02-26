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

exports.custom_args = {
  1: function(test) {
    test.expect(2);

    request({
      url: 'http://localhost:3000/1',
      method: 'GET'
    }, function (err, resp, body) {
      if (resp) {
        test.equal(resp.statusCode, 200, 'should return 200');
        test.equal(body, 'Howdy 1 from development!', 'should return dynamic page');
      }
      test.done();
    });
  },
  2: function(test) {
    test.expect(2);

    request({
      url: 'http://localhost:3000/2',
      method: 'GET'
    }, function (err, resp, body) {
      if (resp) {
        test.equal(resp.statusCode, 200, 'should return 200');
        test.equal(body, 'Howdy 2 from development!', 'should return dynamic page');
      }
      test.done();
    });
  }
};
