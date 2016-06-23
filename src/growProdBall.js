'use strict';

/**
 Called by expandPipeline.js
 */
module.exports = function (parentElementID) {
  var app = require('./app');
  
  var prodDiv = document.getElementById(parentElementID + '-live');
  var prodBallSize = (app.commitsCount / 100) + .075;
  // don't let it get too big
  if (prodBallSize >= 1) {prodBallSize = 1}
  if (app.transformProperty) {
    prodDiv.style[app.transformProperty] = `scale3d(${prodBallSize}, ${prodBallSize}, ${prodBallSize})`;
  }
};