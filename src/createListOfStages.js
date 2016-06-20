'use strict';

/**
 * Build a model of all of the stages in a run
 * Called by addMicroServiceToRegistry.js, updateMicroService.js
 */
module.exports = function (jobName, runStages) {
  var createStage = require('./createStage');

  // console.log('createListOfStages - start');
  var stages = [];
  for (var i = 0; i < runStages.length; i++) {
    var duration = runStages[i].durationMillis - runStages[i].pauseDurationMillis;
    if (duration < 200) {duration=200;}
    // console.log('createListOfStages - ' + jobName + ' ' + runStages[i].name + ' duration = ' + duration);
    stages.push(createStage(jobName, runStages[i].id, runStages[i].name, duration));
  }
  // console.log('createListOfStages - end');

  return stages;
};