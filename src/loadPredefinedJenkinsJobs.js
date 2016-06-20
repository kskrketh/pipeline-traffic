'use strict';

/**
 *
 *
 * Called by app.js
 */
module.exports = function (jenkinsJobs) {
  var loadJenkinsJob = require('./loadJenkinsJob');

  for (var i = 0; i < jenkinsJobs.length; i++) {
    loadJenkinsJob(jenkinsJobs[i]);
  }
};