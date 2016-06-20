'use strict';

/**
 * For each commit/ball look up the stage it goes in and then pull that div and add the commit to it.
 * This should support multiple commits in one stage.
 * This should also support a limited range of stages. (i.e. just new stages)
 * 
 * Called by addPipelineElement.js, updateMicroService.js
 */
module.exports = function (commits, stages, name) {
  var addCommitProdContainerElement = require('./addCommitProdContainerElement');
  var addCommitContainerElement = require('./addCommitContainerElement');
  var addCommitElement = require('./addCommitElement');

  //console.log('addAllCommitElements - start');
  for (var j = 0; j < commits.length; j++) {
    for (var k = 0; k < stages.length; k++) {
      if (stages[k].stageID === commits[j].currentStageID) {
        var stageDiv = document.getElementById(stages[k].id);
        //console.log('addAllCommitElements - id: ' + stages[k].id);
        var commitContainer;
        if (commits[j].currentStage.startsWith('Prod')) {
          commitContainer = stageDiv.appendChild(addCommitProdContainerElement(commits[j], name));
        } else {
          commitContainer = stageDiv.appendChild(addCommitContainerElement(commits[j]));
        }
        commitContainer.appendChild(addCommitElement());
      }
    }
  }
  //console.log('addAllCommitElements - end');
};