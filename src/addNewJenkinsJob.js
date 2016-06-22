'use strict';

/**
 * This is called from a form in the UI that takes Jenkins URL.
 *
 * Called by app.js
 */
module.exports = function () {
  var app = require('./app');
  var setUpPipelineElements = require('./setUpPipelineElements');
  var toggleIntervalOn = require('./toggleIntervalOn');
  var loadJenkinsJob = require('./loadJenkinsJob');

  var inputValue = document.getElementById('JenkinsJobURL');
  var jobURL = inputValue.value;
  app.jenkinsJobs.push(jobURL);
  app.listOfMSNames = setUpPipelineElements(app.jenkinsJobs);
  toggleIntervalOn(false);
  loadJenkinsJob(jobURL);
};