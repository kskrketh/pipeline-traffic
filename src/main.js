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

var processCounter = 0;
var microserviceID = 1;
var currentStageID = 1;
function stageStepGen(microServiceID) {
  var msID = microServiceID;

  var stageSize = 10;
  var stageID = msID + '-' + currentStageID;

  var currentStage = document.getElementById(stageID);
/*
  if (processCounter === 0) {
    currentStage.classList.remove('hidden');
  }
*/

  if (msID.startsWith('ms-prod')) {
    moveBallInProd(currentStage, 0);
    microserviceID = 1;
    currentStageID = 1;
    processCounter = 0;
    return;
    
  } else {
    moveBall(currentStage, processCounter, stageSize);
  }

  if((stageSize) === processCounter) {
    // reset counters and move on
    currentStageID++;
    stageID = msID + '-' + currentStageID;
    var nextStage = document.getElementById(stageID);
    processCounter = 0;
    if (nextStage !== null) {
      moveToNextStage(currentStage, nextStage);
    } else {
      // Go to Prod
      currentStageID = 1;
      nextStage = document.getElementById("ms-prod-1-1");
      moveToNextStage(currentStage, nextStage);
      stageStepGen('ms-prod-1');
    }
  }
  processCounter++;
}

function moveBall(stageId, current, total) {
  var location = (current / total) * 100;

    stageId.classList.remove('hidden');
  if (transformProperty) {
    stageId.style[transformProperty] = 'translate3d(' + location + '% ,0,0)';
  }
}

function moveBallInProd(stageId, prodHeight) {
  var y = prodHeight || 0;
  if (transformProperty) {
    //stageId.style[transformProperty] = 'translate3d(0,0,0)';
    stageId.style[transformProperty] = 'translate3d(50%, ' + y + '% ,0)';
  }
}

function moveToNextStage(currentStageID, nextStageID) {
  currentStageID.classList.add('hidden');
  nextStageID.classList.remove('hidden');
  nextStageID.style[transformProperty] = 'translate3d(0,0,0)';
}

var timer = setInterval(stageStepGen, 500, 'ms-' + microserviceID);

setTimeout(function() {clearInterval(timer)}, 8000);

function commitMergedListener() {

}

function processCompleteListener() {

}

function stageCompleteListener() {

}

var microServiceRegistry = [];

function addMicroServiceToRegistry(msName, msStages) {
  var stage;
  var commit = createCommit(msName, msBuild, sha, 1, 0, msStages.length);
  var ms = {
    name: msName,
    stages: msStages,
    commits: [commit]
  };
  microServiceRegistry.push(ms);
}

function createCommit(jobName, runId, stage, duration) {
  return {
    id: jobName + '-' + runId,
    currentStage: stage,
    runTime: duration
  };
}

function createListOfStages(stagesJSON) {
  var stages = [
    {
      
    }
  ];
  
  return stages;
}

function createStage(jobName, stageId, stageName, duration) {
  return {
    id: stageId,
    name: stageName,
    msName: jobName,
    runTime: duration
  };
}

function addCommitElement(msName, msBuild, stage, sha) {
  var div = document.createElement('div');
  div.id = msName + '-' + msBuild;
}