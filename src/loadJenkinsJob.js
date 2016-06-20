'use strict';

/**
 *
 *
 * Called by loadPredefinedJenkinsJobs.js, addNewJenkinsJob.js
 */
module.exports = function (jenkinsJob) {
  var getJobJSON = require('./getJobJSON');

  // TODO: Add a check to make sure it is a URL, Make sure it is not a duplicate of what we already have.
  getJobJSON(jenkinsJob + 'wfapi');
};