'use strict';

/**
 * For a given pipeline, add all the stages to the UI.
 * Called by addPipelineElement.js, updateMicroService.js
 */
module.exports = function (ms) {
  var pollJenkins = require('./pollJenkins');

  // console.log('addStagesElement - start');
  var stages = document.getElementById(ms.name + '-stages');
  var html = '';

  for (var i = 0; i < ms.stages.length; i++) {
    // We don't want to create a stage container for Production as it has different properties.
    if (!ms.stages[i].name.startsWith('Prod')) {
      html +=`
        <div id="${ms.stages[i].id}" class="stage">
        <h2>${ms.stages[i].name}</h2>
        </div><!-- /stage -->
      `;
    }
  }

  stages.innerHTML = html;
  // console.log('addStagesElement - end');

};