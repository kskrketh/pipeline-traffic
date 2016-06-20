'use strict';

/**
 * If you can find any completed stages, in a completed run, in the UI then remove them. They should already be hidden.
 *
 * Called by updateMicroService.js
 */
module.exports = function (prevMs, runs) {

  // console.log('removeOldCommits - start');
  for (var i = 0; i < runs.length; i++) {
    var stages = runs[i].stages;
    var id = '';
    var j,k;
    // TODO: figure out what to do with duplicates for Pending and Fail
    // console.log('removeOldCommits - status: ' + runs[i].status);
    if (runs[i].status === "SUCCESS" || (i > 0 && (runs[i].status === "FAILED" || runs[i].status === "ABORTED"))) {
      stages = runs[i].stages;
      id = '';
      for (j = 0; j < stages.length; j++) {
        for (k = 0; k < prevMs.commits.length; k++) {
          id = prevMs.name + '-' + runs[i].id + '-' + runs[i].name + '-' + stages[j].id;
          if (prevMs.commits[k].id === id) {
            // console.log('removeOldCommits - id: ' + id);
            document.getElementById(id).remove();
          }
        }
      }
    }
  }
  // console.log('removeOldCommits - end');
};