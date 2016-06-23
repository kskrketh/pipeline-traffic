'use strict';

/**
 * Create a model of a stage
 * 
 * Called by createListOfStages.js
 */
module.exports = function (jobName, stageId, stageName, duration, commitType) {

  // console.log('createStage - start');
  // console.log('createStage - jobName=' + jobName + ', stageId=' + stageId + ', stageName=' + stageName);
  
  return {
    id: jobName + '-' + 'stage' + '-' + stageId,
    stageID: stageId,
    name: stageName,
    msName: jobName,
    duration: duration,
    commitType: commitType
  };
};