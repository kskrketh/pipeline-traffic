'use strict';

// imports
var particles = require('./particles');

var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
var transformProperty = getSupportedPropertyName(transform);

//var ms_1_1 = document.getElementById('ms-1-1');



// Run the particles for traffic display.
particles.init();

function getSupportedPropertyName(properties) {
  for (var i = 0; i < properties.length; i++) {
    if (typeof document.body.style[properties[i]] != "undefined") {
      return properties[i];
    }
  }
  return null;
}

var stageCounter = 0;
var mircroserviceID = 1;
var currentStageID = 1;
function stageStepGen(mircroServiceID) {
  var stageSize = 10;

  var msID = 'ms-' + mircroServiceID;
  var stageID = msID + '-' + currentStageID;

  var currentStage = document.getElementById(stageID);

  moveBall(currentStage, stageCounter, stageSize);
  if(stageSize === stageCounter) {
    // reset counters and move on
    currentStageID++;
    stageID = msID + currentStageID;
    stageCounter = 0;
    moveToNextStage(currentStage, stageID)
  }
  stageCounter++;
}

function moveBall(stageId, current, total) {
  var location = (current / total) * 100;

  stageId.classList.remove('hidden');
  if (transformProperty) {
    stageId.style[transformProperty] = 'translate3d(' + location + '% ,0,0)';
  }
}

function moveToNextStage(currentStageID, nextStageID) {
  currentStageID.classList.add('hidden');
  nextStageID.classList.remove('hidden');
}

var timer = setInterval(stageStepGen(mircroserviceID), 200);

setTimeout(function() {clearInterval(timer)}, 4000);

function commitMergedListener() {

}

function processCompleteListener() {

}

function stageCompleteListener() {

}

