module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'bower_components/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'bower_components/lodash/lodash.js',
      'src/module.js',
      'src/*.js',
      'test/*.js'
    ],
    port: 8067,
    logLevel: config.LOG_INFO,
    singleRun: false,
    browsers: [ 'PhantomJS' ]
  });
};