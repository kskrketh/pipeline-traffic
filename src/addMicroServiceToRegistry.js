'use strict';

/**
 * This is the initial creation of the pipelines and should only be called on page load.
 * 
 * Called by getRunsJSON.js
 */
module.exports = function (runJSON, restURL, msName) {
  var app = require('./app');
  var createListOfStages = require('./createListOfStages');
  var getAllCommits = require('./getAllCommits');
  var addStagesElement = require('./addStagesElement');
  var addAllCommitElements = require('./addAllCommitElements');
  var updateCommitStatus = require('./updateCommitStatus');
  var addPipelineElement = require('./addPipelineElement');
  var toggleIntervalOn = require('./toggleIntervalOn');
  var updateMicroService = require('./updateMicroService');

  // console.log('addMicroServiceToRegistry - start');
  var i, stages, commits;
  var latestRuns = [];
  var statusIsSuccess = false;
  var foundSuccessfulStage = false;

  // Build a smaller list of Job Runs so we don't have deal with the whole thing.
  for (i = 0; i < runJSON.length; i++) {
    latestRuns.push(runJSON[i]);
    // Look for a Successful Run if it can be found.
    if (runJSON[i].status === "SUCCESS") {
      statusIsSuccess = true;
    }
    if (statusIsSuccess && i > 2) {
      break;
    }
  }

  // Get the latest complete list of stages, we need updated times. Search all the Runs we have looking for last Successful one.
  for (i = 0; i < runJSON.length; i++) {
    if (runJSON[i].status === "SUCCESS" ) {
      stages = createListOfStages(msName, runJSON[i].stages);
      foundSuccessfulStage = true;
      break;
    }
  }

  // If no successful runs were found then use the 2nd failed or aborted one.
  if (!foundSuccessfulStage) {
    for (i = 0; i < runJSON.length; i++) {
      if (i > 0 && (runJSON[i].status === "FAILED" || runJSON[i].status === "ABORTED")) {
        stages = createListOfStages(msName, runJSON[i].stages);
        foundSuccessfulStage = false;
        break;
      }
    }
  }

  // returns undefined if all stages are successful
  commits = getAllCommits(msName, latestRuns, stages);

  var ms = {
    name: msName,
    stages: stages,
    commits: commits,
    jobRuns: restURL
  };

  if (document.getElementById(msName)) {
    // if this pipeline already exists on the screen then just update it
    updateMicroService(ms);
  } else {
    app.microServiceRegistry.push(ms);
    addPipelineElement(ms);
  }

  // In case we turn off the Interval, this will turn it back on.
  toggleIntervalOn(true);
  // console.log('addMicroServiceToRegistry - end');
  
  //return microServiceRegistry;
};