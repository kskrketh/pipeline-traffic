'use strict';

/**
 * Build the HTML for the commit / ball
 * 
 * Called by addAllCommitElements.js
 */
module.exports = function () {
  var div = document.createElement('div');
  div.classList.add('commit');

  return div;
};