'use strict';

/**
 * Build the HTML for the commit / ball container
 * 
 * Called by addAllCommitElements.js
 */
module.exports = function (commit) {

  //console.log('addCommitContainerElement - start');
  var div = document.createElement('div');
  div.id = commit.id;
  div.classList.add('commit-container', commit.status, 'commit-' + commit.commitType);
  //div.style = 'transform: translate3d(0%, 0, 0);';
  //if (!commit.duration) {commit.duration === 5000};
  div.style = 'animation-duration: ' + commit.duration + 'ms;';
  // console.log('addCommitContainerElement - div style string: ' + 'animation-duration: ' + commit.duration + 'ms;');
  // console.log('addCommitContainerElement - end');

  return div;
};