'use strict';

/**
 Called by expandPipeline.js, compressPipeline.js
 */
module.exports = function (parentElementID, parent) {

  var stagesID = parentElementID + '-stages';
  var stageHeight = document.getElementById(stagesID).firstElementChild.offsetHeight;
  var stageAmount = Math.floor(stageHeight / 25);
  parent.classList.add('microservice-large-' + stageAmount);
};