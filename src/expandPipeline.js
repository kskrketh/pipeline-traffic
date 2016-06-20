'use strict';

/**
 Called by index.html but set in addPipelineElement.js
 */
module.exports = function (parentElementID) {
  var app = require('./app');
  var growProdBall = require('./growProdBall');
  var addStageHeightRowNumberClass = require('./addStageHeightRowNumberClass');

  var parent = document.getElementById(parentElementID);
  app.enlargedMS = parentElementID;
  // TODO: remove the large class from all nodes.
  app.expandedView = true;
  parent.classList.add('microservice-large');
  var prodDiv = parent.firstElementChild;
  growProdBall(prodDiv);
  // removeLargeStageRowClass(parentElementID);
  setTimeout(function(){addStageHeightRowNumberClass(parent)}, 250);
};