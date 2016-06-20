'use strict';

/**
 * For a given Job / MicroService add it to the UI.
 * Called by addMicroServiceToRegistry.js
 */
module.exports = function (ms) {
  var addStagesElement = require('./addStagesElement');
  var addAllCommitElements = require('./addAllCommitElements');

  // console.log('addPipelineElement - start');
  var pipeline = document.getElementById("pipeline-container");
  var div = document.createElement('div');
  div.id = ms.name;
  div.classList.add('microservice');

  div.innerHTML =`
    <h1>
      ${ms.name}
      <!-- <span>build: ms. </span> -->
    </h1>
    <div class="microservice-actions">
      <a href="#" onclick="app.removePipeline('pipeline-container', '${ms.name}');return false;"><i class="fa fa-trash" aria-hidden="true"></i></a>
      <a href="#" onclick="app.expandPipeline('${ms.name}') ;return false;"><i class="fa fa-expand" aria-hidden="true"></i></a>
      <a href="#" class="hidden" onclick="app.compressPipeline('${ms.name}') ;return false;"><i class="fa fa-compress" aria-hidden="true"></i></a>
    </div>
    <div id="${ms.name}-stages" class="stages">
    </div><!-- /stages -->
    <div id="${ms.stages[ms.stages.length - 1].id}"  class="stage stage-lg">
      <h2>Production</h2>
      <div id="${ms.name}-prod-1" class="commit-container">
        <div id="${ms.name}-live" class="commit" style="transform: scale3d(1, 1, 1)"></div>
      </div>
      <div id="${ms.name}-prod-2" class="commit-container hidden">
        <div id="${ms.name}-dead" class="commit" style="transform: scale3d(1, 1, 1)"></div>
      </div>
    </div><!-- /stage-lg -->
    `;

  pipeline.appendChild(div);
  addStagesElement(ms);
  addAllCommitElements(ms.commits, ms.stages, ms.name);
  // addStageHeightRowNumberClass(ms.name);
  // console.log('addPipelineElement - end');

};