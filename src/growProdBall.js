'use strict';

/**
 Called by expandPipeline.js
 */
module.exports = function (prodDiv) {
  var app = require('./app');
  
  var prodBallSize = (app.commitsCount / 100) + .075;
  if (prodBallSize >= 1) {prodBallSize = 1}
  if (app.transformProperty) {
    prodDiv.style[app.transformProperty] = `scale3d(${prodBallSize}, ${prodBallSize}, ${prodBallSize})`;
  }
};