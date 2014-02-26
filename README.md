# grunt-express-server

> Grunt task for running an ExpressJS app (compatible with grunt-contrib-watch)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-express-server --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-express-server');
```

## The "express_server" task

### Overview
In your project's Gruntfile, add a section named `express_server` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  express_server: {
    options: {
      // Override defaults here
    },
    dev: {
      options: {
        script: 'path/to/dev/server.js'
      }
    },
    prod: {
      options: {
        script: 'path/to/prod/server.js',
        node_env: 'production'
      }
    },
    test: {
      options: {
        script: 'path/to/test/server.js'
      }
    }
  }
});
```

### Options

#### options.script
Type: `String`
Default value: `undefined`

The path for the ExpressJS (or Connect or http) app to run (localized to the Gruntfile).

#### options.cmd
Type: `String`
Default value: `process.argv[0]`

Override the command used to start the server.
(e.g. 'coffee' instead of the default 'node' to enable CoffeeScript support)

#### options.args
Type: `Array`
Default value: `[]`

Will turn into: `CMD path/to/script.js ARG1 ARG2 ... ARGN`

#### options.background
Type: `Boolean`
Default value: `true`

Setting to `false` will effectively just run `CMD path/to/script.js`
Use `SIGINT` to kill the process 

#### options.port
Type: `Number`
Default value: `[]`

Override node env's PORT

#### options.node_env
Type: `String`
Default value: `undefined`

Override node env's NODE_ENV

#### options.delay
Type: `Number`
Default value: `0`

Consider the server to be "running" after an explicit delay (in milliseconds)
This is the default method for backgrouding the process.

#### options.output
Type: `String` or `RegExp`
Default value: `undefined`

String or regular expression that matches app output to indicate it is "running" (string match is case insensitive)
This option supercedes the `delay` option

#### options.debug
Type: `Boolean`
Default value: `[]`

Set `--debug`

### Usage Examples

#### Default Options
By default, unless `delay` or `output` options are specificied, the task will assume the app is ready immediately.

#### Starting the server

This is the basic example for backgrounding an instance of the specified app.

```js
grunt.initConfig({
  express_server: {
    options: {
      script: './path/to/server.js'
    },
  },
});
```

Add the `background` option to run the app as a foreground process.

```js
grunt.initConfig({
  express_server: {
    options: {
      script: './path/to/server.js',
      background: true
    },
  },
});
```

#### Custom Options
In this example, two tasks are configured. The first task will set `process.env.PORT` to `8080` and then wait for `STDOUT` to contain `listening` before ceding control back to Grunt for subsequent tasks to run. The second task will set `process.env.NODE_ENV` to `production` and then wait 1 second before ceding control back to Grunt for subsequent tasks to run.

```js
grunt.initConfig({
  express_server: {
    port: {
      options: {
        port: 8080,
        output: 'listening'
      }
    },
    env: {
      options: {
        node_env: 'production',
        delay: 1000
      }
    }
  },
});
```

#### Stopping the server

All instances of the specified app will only run for as long as Grunt is running. Once Grunt has terminated all running app instances will terminate.

To terminate a backgrounded app, run the task target again with `:stop`. For example if the basic express_server task shown above was run, then running `express_server:stop` as a task will terminate the app instance. Note that if the same task target is called without a `:stop` task in between them, the original app target instance will be stopped and a new one will be started.

This is a typical use case:
```js
grunt express_server:TARGET SOME:OTHER:TASKS express_server:TARGET:stop
```

If the specified script was run in foreground then terminating Grunt will terminate the app instance. Note this is a blocking task. Also note that if the specificied script exports an http or Connect instance, express_server will call the `close` handler on the instance to exit.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
