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
  var prodDiv = document.getElementById(parentElementID + '-live');
  prodDiv.classList.add('commit-large');
  app.fullSizePipelineID = parentElementID;
  // Set the initial size of the prod ball to small.
  growProdBall(parentElementID);
  // wait for the page to load and then get the height so we know how many rows there are to balls in
  setTimeout(function(){addStageHeightRowNumberClass(parentElementID, parent)}, 250);
};