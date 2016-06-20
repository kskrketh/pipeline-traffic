'use strict';

/**
Called by toggleIntervalOn.js
*/
module.exports = function () {
  var app = require('./app');
  var getRunsJSONUpdates = require('./getRunsJSONUpdates');

  // console.log('pollJenkins - start =====================================================================================');
  for (var i = 0; i < app.microServiceRegistry.length; i++) {
    getRunsJSONUpdates(app.microServiceRegistry[i]);
  }
};
