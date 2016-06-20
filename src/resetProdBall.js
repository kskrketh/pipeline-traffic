'use strict';

/**
 Called by compressPipeline.js
 */
module.exports = function (prodDiv) {
  var app = require('./app');

  if (app.transformProperty) {
    prodDiv.style[app.transformProperty] = 'scale3d(1, 1, 1)';
  }
};