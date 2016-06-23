'use strict';

/**
 *
 *
 * Called by addMicroServiceToRegistry.js, updateMicroService.js
 */
module.exports = function (stages) {
  var pollJenkins = require('./pollJenkins');

  var prodType = stages[stages.length - 1].name.split(':')[1];
  // var prodType = stageName.split(':')[1];

  if (prodType === 'canary') {
    return 'canary';
  } else if (prodType === 'blue') {
    return 'green';
  } else if (prodType === 'green') {
    return 'blue';
  } else {
    return 'live';
  }
};