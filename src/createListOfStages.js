'use strict';

/**
 * Build a model of all of the stages in a run
 * Called by addMicroServiceToRegistry.js, updateMicroService.js
 */
module.exports = function (jobName, runStages) {
  var createStage = require('./createStage');
  var setCommitType = require('./setCommitType');

  // console.log('createListOfStages - start');
  var stages = [];
  var commitType = setCommitType(runStages);
  for (var i = 0; i < runStages.length; i++) {
    var duration = runStages[i].durationMillis - runStages[i].pauseDurationMillis;
    if (duration < 200) {duration=200;}
    // console.log('createListOfStages - ' + jobName + ' ' + runStages[i].name + ' duration = ' + duration);
    stages.push(createStage(jobName, runStages[i].id, runStages[i].name, duration, commitType));
  }
  // console.log('createListOfStages - end');

  return stages;
};