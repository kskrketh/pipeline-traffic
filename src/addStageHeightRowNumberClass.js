'use strict';

/**
 Called by expandPipeline.js, compressPipeline.js
 */
module.exports = function (msLarge) {

  var stagesID = msLarge + '-stages';
  var stageHeight = document.getElementById(stagesID).firstElementChild.offsetHeight;
  var stageAmount = Math.floor(stageHeight / 25);
  msLarge.classList.add('microservice-large-' + stageAmount);
};