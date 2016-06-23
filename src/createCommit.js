'use strict';

/**
 *
 *
 * Called by getAllCommits.js
 */
module.exports = function (jobName, runId, runName, runStatus, stageId, stageName, stageStatus, duration, commitType) {
  var stageMovementFactor = 300;
  // console.log('createCommit - id: ' + jobName + '-' + runId + '-' + runName + '-' + stageId);
  // console.log('createCommit - duration: ' + duration);
  return {
    id: jobName + '-' + runId + '-' + runName + '-' + stageId,
    runId: runId,
    runName: runName,
    runStatus: runStatus,
    currentStageID: stageId,
    currentStage: stageName,
    status: stageStatus.toLowerCase(),
    duration: duration,
    commitType: commitType,
    stageMovementInterval: (stageMovementFactor/duration)*100,
    amountOfStageComplete: 0
  };
};