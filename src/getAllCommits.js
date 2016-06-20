'use strict';

/**
 *
 *
 * Called by addMicroServiceToRegistry.js, updateMicroService.js
 */
module.exports = function (jobName, runs, msStages) {
  var createCommit = require('./createCommit');

  // console.log('getAllCommits - start');
  var commits = [], stages, i, j;

  for (i = 0; i < runs.length; i++) {
    // console.log('getAllCommits - status = ' + runs[i].status);
    if (runs[i].status === 'IN_PROGRESS' || runs[i].status === 'PAUSED_PENDING_INPUT' || runs[i].status === 'NOT_EXECUTED') {
      // console.log('getAllCommits - run status = IN_PROGRESS, PAUSED_PENDING_INPUT, or NOT_EXECUTED');
      stages = runs[i].stages;
      for (j = 0; j < stages.length; j++) {
        commits.push(createCommit(jobName, runs[i].id, runs[i].name, runs[i].status, stages[j].id, stages[j].name, stages[j].status, msStages[j].duration));
      }
    }
    if (i===0 && (runs[i].status === 'FAILED' || runs[i].status === 'ABORTED')) {
      // If there are multiple failures we only need to display the latest.
      // console.log('getAllCommits - run status = FAILED or ABORTED');
      stages = runs[i].stages;
      for (j = 0; j < stages.length; j++) {
        commits.push(createCommit(jobName, runs[i].id, runs[i].name, runs[i].status, stages[j].id, stages[j].name, stages[j].status, msStages[j].duration));
      }
      break;
    }
  }
  // console.log('getAllCommits - end');
  return commits;
};