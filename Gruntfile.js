/*
 * grunt-express-server
 * https://github.com/GlobalDomestic/grunt-express-server
 *
 * Copyright (c) 2014 GlobalDomestic
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'tests/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    express_server: {
      options: {
        script: './test/delay.js'
      },
      defaults: {},
      args: {
        options: {
          args: [1, 2],
          output: 'listening'
        }
      },
      background: {
        options: {
          background: false,
          script: './test/server.js'
        }
      },
      delay: {
        options: {
          delay: 1000
        }
      },
      port: {
        options: {
          port: 8080,
          output: 'listening'
        }
      },
      env: {
        options: {
          node_env: 'production',
          output: 'listening'
        }
      },
      output: {
        options: {
          output: 'listening'
        }
      },
      outputRegexp: {
        options: {
          output: /listening/
        }
      }
    },

    // Unit tests.
    nodeunit: {
      notConnected: {
        src: 'test/not_connected_test.js'
      },
      connected: {
        src: 'test/connected_test.js'
      },
      env: {
        src: 'test/env_test.js'
      },
      port: {
        src: 'test/port_test.js'
      },
      args: {
        src: 'test/args_test.js'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'nodeunit:notConnected',
    'express_server:defaults',
      'nodeunit:notConnected',
      'express_server:defaults:stop',
    'nodeunit:notConnected',
    'express_server:output',
      'nodeunit:connected',
      'express_server:output:stop',
    'express_server:outputRegexp',
      'nodeunit:connected',
      'express_server:outputRegexp:stop',
    'express_server:args',
      'nodeunit:connected',
      'nodeunit:args',
      'express_server:args:stop',
    'express_server:delay',
      'nodeunit:connected',
      'express_server:delay:stop',
    'express_server:port',
      'nodeunit:port',
      'express_server:port:stop',
    'express_server:env',
      'nodeunit:env',
      'express_server:env:stop',
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
