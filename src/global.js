'use strict';

/**
 *
 *
 * Called by app.js
 */
module.exports = function () {
  var pollJenkins = require('./pollJenkins');

  var timer;
  if (intervalIsOn) {
    timer = setInterval(pollJenkins, 500);
  } else {
    clearInterval(timer);
  }
};