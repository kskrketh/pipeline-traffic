'use strict';

/**
 * Build the HTML for the commit / ball Production container
 *
 * Called by addAllCommitElements.js
 */
module.exports = function (commit, name) {
  var app = require('./app');
  var pollJenkins = require('./pollJenkins');
  var growProdBall = require('./growProdBall');

  var stageName = commit.currentStage.split(':');
  var prodType = stageName[1];
  var div = document.createElement('div');
  div.id = commit.id;
  if (prodType === 'canary') {
    div.classList.add('commit-container', 'commit-' + prodType, 'commit-top');
  } else if (prodType === 'blue') {
    div.classList.add('commit-container', commit.status, 'commit-' + prodType, 'commit-top');
  } else if (prodType === 'green') {
    div.classList.add('commit-container', commit.status, 'commit-' + prodType, 'commit-bottom');
  } else {
    div.classList.add('commit-container', commit.status, 'commit-' + prodType);
  }
  //div.style = 'transform: translate3d(0%, 0, 0);';
  div.style = 'animation-duration: ' + commit.duration + 'ms;';

  // Once we have the production commit in the production stage, prep the static production 'ball' to change color to match.
  // This way the commits can be removed from the DOM and the static production ball will still look the same
  var prod1Div = document.getElementById(name + '-prod-1');
  var prod2Div = document.getElementById(name + '-prod-2');

  if (prodType === 'blue') {
    //prod1Div.classList.add('hidden');
    prod1Div.classList.add('commit-top');
    prod2Div.classList.add('commit-bottom');
    prod2Div.classList.remove('hidden');
    prod1Div.firstElementChild.id = name + '-' + prodType;
  } else if (prodType === 'green') {
    prod2Div.classList.add('commit-bottom');
    prod1Div.classList.add('commit-top');
    prod2Div.firstElementChild.id = name + '-' + prodType;
  } else if (prodType === 'canary') {
    prod1Div.classList.add('hidden');
    prod2Div.classList.add('commit-bottom');
    prod2Div.classList.remove('active');
    prod2Div.classList.remove('hidden');
    prod2Div.firstElementChild.id = name + '-live';
    prod1Div.classList.add('commit-' + prodType, 'commit-top', 'active');
  } else {
    prod1Div.classList.add('active');
    prod1Div.classList.remove('commit-top');
    prod1Div.classList.remove('commit-' + prodType);
    prod2Div.classList.remove('commit-' + prodType);
    prod1Div.classList.remove('active');
    prod2Div.classList.add('commit-' + prodType, 'hidden');
    prod1Div.firstElementChild.id = name + '-live';
    prod2Div.firstElementChild.id = name + '-dead';
  }
  setTimeout(function(){
    if (prodType === 'blue') {
      prod2Div.classList.remove('active');
      prod1Div.classList.add('commit-' + prodType, 'active');
      prod1Div.classList.remove('hidden');
      prod1Div.firstElementChild.id = name + '-' + prodType;
    } else if (prodType === 'green') {
      prod1Div.classList.remove('active');
      prod2Div.classList.add('commit-' + prodType, 'active');
      prod2Div.classList.remove('hidden');
      prod2Div.firstElementChild.id = name + '-' + prodType;
    } else if (prodType === 'canary') {
      prod1Div.classList.remove('hidden');
      prod1Div.firstElementChild.id = name + '-' + prodType;
    } else {
      prod1Div.classList.add('active');
      prod1Div.classList.remove('commit-top');
      prod1Div.classList.remove('commit-' + prodType);
      prod2Div.classList.remove('commit-' + prodType);
      prod2Div.classList.remove('active');
      prod2Div.classList.add('hidden');
      prod1Div.firstElementChild.id = name + '-live';
      prod2Div.firstElementChild.id = name + '-dead';
    }
    if(app.expandedView) {
      growProdBall(app.fullSizePipelineID);
    }
  }, commit.duration );

  // Check to see if we are in the expanded view and then start counting
  if(app.expandedView) {
    app.commitsCount++;
  }

  return div;
};