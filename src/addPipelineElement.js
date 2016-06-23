'use strict';

/**
 * For a given Job / MicroService add it to the UI.
 * Called by addMicroServiceToRegistry.js
 */
module.exports = function (ms) {
  var app = require('./app');
  var addStagesElement = require('./addStagesElement');
  var addAllCommitElements = require('./addAllCommitElements');

  var prod1ChildDivID;
  var prod2ChildDivID;
  var prod1Type;
  var prod2Type;
  var hidden1 = '';
  var hidden2 = '';
  var top;
  var bottom;
  var prodType = ms.stages[0].commitType;
  if (prodType === 'canary') {
    prod1ChildDivID = ms.name + '-canary';
    prod2ChildDivID = ms.name + '-live';
    prod1Type = 'commit-canary';
    prod2Type = 'commit-live';
    hidden1 = 'hidden';
    top = '';
    bottom = '';
  } else if (prodType === 'blue' || prodType === 'green') {
    prod1ChildDivID = ms.name + '-blue';
    prod2ChildDivID = ms.name + '-green';
    prod1Type = 'commit-blue';
    prod2Type = 'commit-green';
    top = 'commit-top';
    bottom = 'commit-bottom';
  } else {
    prod1ChildDivID = ms.name + '-live';
    prod2ChildDivID = ms.name + '-dead';
    prod1Type = 'commit-live';
    prod2Type = '';
    hidden2 = 'hidden';
    top = '';
    bottom = '';
  }

  // console.log('addPipelineElement - start');
  var i;
  for(i=0; i < app.listOfMSNames.length; i++) {
    if(app.listOfMSNames[i] === ms.name) {
      var parentDiv = document.getElementById("microservice-" + i);
      break;
    }
  }
  
  var div = document.createElement('div');
  div.id = ms.name;
  div.classList.add('microservice');
  div.setAttribute('ondragstart', 'app.drag(event)');
  div.setAttribute('draggable', 'true');

  div.innerHTML =`
    <h1>
      ${ms.name}
      <!-- <span>build: ms. </span> -->
    </h1>
    <div class="microservice-actions">
      <a href="#" onclick="app.removePipeline('pipeline-container', 'microservice-${i}');return false;"><i class="fa fa-trash" aria-hidden="true"></i></a>
      <a href="#" onclick="app.expandPipeline('${ms.name}') ;return false;"><i class="fa fa-expand" aria-hidden="true"></i></a>
      <a href="#" class="hidden" onclick="app.compressPipeline('${ms.name}') ;return false;"><i class="fa fa-compress" aria-hidden="true"></i></a>
    </div>
    <div id="${ms.name}-stages" class="stages">
    </div><!-- /stages -->
    <div id="${ms.stages[ms.stages.length - 1].id}"  class="stage stage-lg">
      <h2>Production</h2>
      <div id="${ms.name}-prod-1" class="commit-container active ${hidden1} ${top} ${prod1Type}">
        <div id="${prod1ChildDivID}" class="commit" style="transform: scale3d(1, 1, 1)"></div>
      </div>
      <div id="${ms.name}-prod-2" class="commit-container ${hidden2} ${bottom} ${prod2Type}">
        <div id="${prod2ChildDivID}" class="commit" style="transform: scale3d(1, 1, 1)"></div>
      </div>
    </div><!-- /stage-lg -->
  `;

  parentDiv.appendChild(div);
  addStagesElement(ms);
  addAllCommitElements(ms.commits, ms.stages, ms.name);
  // addStageHeightRowNumberClass(ms.name);
  // console.log('addPipelineElement - end');

};