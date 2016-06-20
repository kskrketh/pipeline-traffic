'use strict';

/**
This is how we know when a new Run happens and update the UI with it.
Called by getRunsJSONUpdates.js
*/
module.exports = function (ms, jobRuns) {
  var createListOfStages = require('./createListOfStages');
  var getAllCommits = require('./getAllCommits');
  var addStagesElement = require('./addStagesElement');
  var addAllCommitElements = require('./addAllCommitElements');
  var updateCommitStatus = require('./updateCommitStatus');
  var removeOldCommits = require('./removeOldCommits');

  // console.log('updateMicroService - start ' + ms.name + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  var i,j;
  var oldNumberOfStages = ms.stages.length;
  var newNumberOfStages;
  var prevMs = JSON.parse(JSON.stringify(ms)); // deep-copy commits
  var commitsToAdd = [];
  var latestRuns = [];
  var statusIsSuccess = false;
  var foundSuccessfulStage = false;

  // Build a smaller list of Job Runs so we don't have deal with the whole thing.
  for (i = 0; i < jobRuns.length; i++) {
    latestRuns.push(jobRuns[i]);
    // Look for a Successful Run if it can be found.
    if (jobRuns[i].status === "SUCCESS") {
      statusIsSuccess = true;
    }
    if (statusIsSuccess && i > 2) {
      break;
    }
  }

  // Get the latest complete list of stages, we need updated times. Search all the Runs we have looking for last Successful one.
  for (i = 0; i < jobRuns.length; i++) {
    if (jobRuns[i].status === "SUCCESS" ) {
      newNumberOfStages = jobRuns[i].stages.length;
      ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
      foundSuccessfulStage = true;
      break;
    }
  }

  // If no successful runs were found then use the 2nd failed or aborted one.
  if (!foundSuccessfulStage) {
    for (i = 0; i < jobRuns.length; i++) {
      if (i > 0 && (jobRuns[i].status === "FAILED" || jobRuns[i].status === "ABORTED")) {
        newNumberOfStages = jobRuns[i].stages.length;
        ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
        foundSuccessfulStage = false;
        break;
      }
    }
  }

  //TODO: what if first run and no stages exist?

  // Get all the currently active Job Runs, not just the latest
  ms.commits = getAllCommits(ms.name, latestRuns, ms.stages);

  // Get a list of the commits that have just been added
  for (i = 0; i < ms.commits.length; i++) {
    var foundMatchingCommit = false;
    for (j = 0; j < prevMs.commits.length; j++) {
      // console.log('updateMicroService - Comparing ms.commits['+ i +'].id = '+ ms.commits[i].id + ' to prevMs.commits['+ j +'].id = '+ prevMs.commits[j].id);
      if (ms.commits[i].id == prevMs.commits[j].id) {
        foundMatchingCommit = true;
      }
    }
    if (!foundMatchingCommit) {
      // console.log('updateMicroService - Adding ms.commits['+ i +'].id = '+ ms.commits[i].id);
      commitsToAdd.push(ms.commits[i])
    }
  }


  // Compare old stages to new to see if they changed. If they changed then update the html.
  if (oldNumberOfStages !== newNumberOfStages) {
    addStagesElement(ms);
    addAllCommitElements(ms.commits, ms.stages, ms.name);
    // TODO: need to reset position of commits if they are moving/transitioning in the pipeline
  } else {
    updateCommitStatus(ms, prevMs);
    removeOldCommits(prevMs, latestRuns);
    if (commitsToAdd.length > 0) {
      addAllCommitElements(commitsToAdd, ms.stages, ms.name);
    }
  }
  // console.log('updateMicroService - end>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

  return ms;
};