'use strict';

// This was the original way to move the commit within a stage, now it is done via CSS duration feature.
//   It is kept here in case we need more control over the movement.
// Called by ???
module.exports = function (microServiceRegistry, transformProperty) {
  var pollJenkins = require('./pollJenkins');

  console.log('moveCommits - start');
  for (var i = 0; i < microServiceRegistry.length; i++) {
    for (var j = 0; j < microServiceRegistry[i].commits.length; j++) {
      var commit = microServiceRegistry[i].commits[j];
      if (commit.status === 'in_progress') {
        if (commit.amountOfStageComplete > 99) {
          continue;
        }
        console.log('commit.id = ' + commit.id + ' | commit.amountOfStageComplete = ' + commit.amountOfStageComplete);
        commit.amountOfStageComplete = commit.amountOfStageComplete + commit.stageMovementInterval;
        var commitDiv = document.getElementById(commit.id);
        if (transformProperty) {
          commitDiv.style[transformProperty] = 'translate3d(' + commit.amountOfStageComplete + '% ,0,0)';
        }
      }
    }
  }
  
//var timer1 = setInterval(moveCommits, 300);

//setTimeout(function() {clearInterval(timer1)}, 8000);

};
