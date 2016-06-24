'use strict';

/**
 * Called by index.html but set in addPipelineElement.js 
 */
module.exports = function (parentElementID) {
  var app = require('./app');
  var removeLargeStageRowClass = require('./removeLargeStageRowClass');
  var resetProdBall = require('./resetProdBall');

  var parent = document.getElementById(parentElementID);
  app.enlargedMS = parentElementID;
  parent.classList.remove('microservice-large');
  var prodDiv = document.getElementById(parentElementID + '-live');
  prodDiv.classList.remove('commit-large');
  app.expandedView = false;
  removeLargeStageRowClass(parentElementID);
  resetProdBall(prodDiv);
  app.commitsCount = 0;
};