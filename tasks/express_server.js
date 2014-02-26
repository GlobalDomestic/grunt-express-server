/*
 * grunt-express-server
 * https://github.com/GlobalDomestic/grunt-express-server
 *
 * Copyright (c) 2014 GlobalDomestic
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');

module.exports = function(grunt) {
  var servers = {};
  var actions = {
    'start': 'start',
    'stop': 'stop',
    '_default_': 'start'
  };

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('express_server', 'Grunt task for running an ExpressJS app (compatible with grunt-contrib-watch)', function() {
    // Tell grunt this task is asynchronous.
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      cmd: process.argv[0],
      args: [],
      node_env: undefined,
      background: true,
      port: 3000,
      debug: false,
      delay: 0,
      output: undefined,
    });
    var action = actions[this.args.shift()] || actions._default_;
    var target = this.target || 'express';

    options.script = path.resolve(options.script);

    if (!grunt.file.exists(options.script)) {
      grunt.fatal('Unable to locate specified ExpressJS app: %s', options.script);
    }

    if (options.output && !(options.output instanceof RegExp)) {
      options.output = new RegExp(options.output, 'i');
    }

    if (grunt.option('debug')) {
      options.debug = true;
    }

    options.args.unshift(options.script);

    if (!servers[target]) {
      servers[target] = new ExpressServer(options);
    }

    servers[target][action](done);
  });

  // ExpressServer
  function ExpressServer(options) {
    this.name = 'ExpressServer';
    this.options = options;

    this.start = function start(cb) {
      if (this.server) {
        this.stop(function() {this._start(cb);}.bind(this));
      }
      else {
        this._start(cb);
      }
    };

    this._start = function _start(cb) {
      // Preserve existing process.env while we spin up the server with specified options
      var env = JSON.parse(JSON.stringify(process.env));

      grunt.verbose.writeln('Setting up %s ExpressJS app', (this.options.background ? 'background' : 'foreground'));

      if (this.options.node_env) {
        grunt.verbose.write('>> '.green);
        grunt.verbose.writeln('NODE_ENV: %s', this.options.node_env);
        process.env.NODE_ENV = this.options.node_env;
      }

      if (this.options.port) {
        grunt.verbose.write('>> '.green);
        grunt.verbose.writeln('PORT: %s', this.options.port);
        process.env.PORT = this.options.port;
      }

      if (this.options.debug) {
        grunt.verbose.write('>> '.green);
        grunt.verbose.writeln('Debug enabled');
        this.options.args.unshift('--debug');
      }

      if (this.options.background) {
        grunt.log.write('Starting background ExpressJS app...');
        this.server = grunt.util.spawn({
          cmd: options.cmd,
          args: options.args,
          env: process.env
        }, function() {
          grunt.verbose.writeln('Exiting ExpressJS app'.yellow);
        });

        //if (this.options.repeat) {
          this.server.stdout.pipe(process.stdout);
          this.server.stderr.pipe(process.stderr);
        //}

        if (this.options.output) {
          this.server.stdout.on('data', function (data) {
            var message = String(data);
            if (message.match(this.options.output)) {
              grunt.log.ok();
              grunt.verbose.write('>> '.green);
              grunt.verbose.writeln('Matched ExpressJS app stdout stream: ' + '%s'.green, message);
              cb();
            }
          }.bind(this));
        }
        else {
          setTimeout(function () {
            grunt.log.ok();
            grunt.verbose.write('>> '.green);
            grunt.verbose.writeln('Delay timeout done.');
            cb();
          }, this.options.delay);
        }
      }
      else {
        this.server = require(this.options.script);
        grunt.log.writeln('ExpressJS app running (use SIGINT to stop)...'.green);
        // Since this is a foreground process, it will halt
        // GruntJS until the cb is executed.
        process.once('SIGINT', this.stop.bind(this,cb));
      }

      // Restore preserved process.env
      if (env) {
        process.env = JSON.parse(JSON.stringify(env));
      }

      // Grunt doesn't output logs if stop is called on exit but it
      // will still shut down the spawned processes.
      process.once('exit', this.stop.bind(this,cb));
    };

    this.stop = function stop(cb) {
      grunt.log.write('Stopping ExpressJS app...');

      var scb = function () {
        grunt.log.ok();
        delete this.server;
        cb();
      }.bind(this);

      cb = cb || function() {};

      if (this.server) {
        if (this.server.pid) {
          this.server.once('exit', scb);
          this.server.kill();
        }
        else if (this.server.close) {
          this.server.close(scb);
        }
        else {
          scb();
        }
      }
      else {
        scb();
      }
    };
  }
};