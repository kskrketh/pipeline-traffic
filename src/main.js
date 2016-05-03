'use strict';

// imports
var particles = require('./particles');

var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
var transformProperty = getSupportedPropertyName(transform);

var jenkinsJobs = [
  'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example/',
  'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example-copy1/',
  'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example-copy2/'
];



// Run the particles for traffic display.
particles.init();

function loadPredefinedJenkinsJobs(jenkinsJobs) {
  for (var i = 0; i < jenkinsJobs.length; i++) {
    addMicroServiceToRegistry(getJSON(jenkinsJobs[i] + 'wfapi'), getJSON(jenkinsJobs[i] + 'wfapi/runs'));
  }
}
loadPredefinedJenkinsJobs(jenkinsJobs);




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

//var timer1 = setInterval(stageStepGen, 500, 'ms-' + microserviceID);

//setTimeout(function() {clearInterval(timer1)}, 8000);






var microServiceRegistry = [];

function createCommit(jobName, runId, runName, stageId, stageName, stageStatus, duration) {
  return {
    id: jobName + '-' + runId + '-' + runName + '-' + stageId,
    currentStageID: stageId,
    currentStage: stageName,
    status: stageStatus.toLowerCase(),
    runTime: duration
  };
}
function getAllCommits(jobName, runs) {
  var i;
  var commits = [];
  var runId = runs[0].id;
  var runName = runs[0].name;
  var stages = runs[0].stages;

  for (i = 0; i < stages.length; i++) {
/*
    // This is only needed if we place a commit in the Prod area.
    if (stages[stages.length - 1].status === "SUCCESS") {
      commit = createCommit(jobName, runId, runName, stages[stages.length - 1].id, stages[stages.length - 1].name, stages[stages.length - 1].status, stages[stages.length - 1].durationMillis);
      break;
    } else
*/
      commits.push(createCommit(jobName, runId, runName, stages[i].id, stages[i].name, stages[i].status, stages[i].durationMillis));
    //}
  }

  return commits;
}

function addCommitElement(commit) {
  var div = document.createElement('div');
  div.id = commit.id;
  div.classList.add('commit', commit.status);
  div.style = 'transform: translate3d(0%, 0, 0);';

  return div;
}
function addAllCommitElements(ms) {
  for (var i = 0; i < ms.commits.length; i++) {
    var stageDiv = document.getElementById(ms.stages[i].id);
    stageDiv.appendChild(addCommitElement(ms.commits[i]));
  }
}
function updateCommitStatus(ms, oldCommits) {

  if (ms.commits.length === oldCommits.length) {
    for (var i = 0; i < ms.commits.length; i++) {
      if (ms.commits[i].status != oldCommits[i].status) {
        var commitDiv = document.getElementById(ms.commits[i].id);
        commitDiv.classList.add(ms.commits[i].status);
        commitDiv.classList.remove(oldCommits[i].status);
      }
    }
  }
}

function createStage(jobName, stageId, stageName, duration) {
  return {
    id: jobName + '-' + 'stage' + '-' + stageId,
    stageID: stageId,
    name: stageName,
    msName: jobName,
    runTime: duration
  };
}

function createListOfStages(jobName, runStages) {
  var stages = [];
  for (var i = 0; i < runStages.length; i++) {
    stages.push(createStage(jobName, runStages[i].id, runStages[i].name, runStages[i].durationMillis));
  }
  return stages;
}

function addStagesElement(ms) {
  var stages = document.getElementById(ms.name + '-stages');
  var html = '';

  for (var i = 0; i < ms.stages.length; i++) {
    html += 
      '<div id="' + ms.stages[i].id + '" class="stage">' +
        '<h2>' + ms.stages[i].name + '</h2>' +
      '</div><!-- /stage -->';
  }

  stages.innerHTML = html;
}

function addPipelineElement(ms) {
  var pipeline = document.getElementById("pipeline-container");
  var div = document.createElement('div');
  div.id = ms.name;
  div.classList.add('microservice');

  div.innerHTML =
    '<h1>' +
      ms.name + //':' +
      //'<span>build: ' + ms. + '</span>' +
    '</h1>' +
    '<div id="' + ms.name + '-stages" class="stages">' +
    '</div><!-- /stages -->' +
    '<div class="stage stage-lg">' +
      '<h2>Production</h2>' +
      '<div id="' + ms.name + '-prod-1" class="commit" style="transform: translate3d(50%, 0, 0);"></div>' +
    '</div><!-- /stage-lg -->';

  pipeline.appendChild(div);
  addStagesElement(ms);
  addAllCommitElements(ms)
}

function addMicroServiceToRegistry(jobURL, jobRunsURL) {
  var i, stages, job, jobRuns, commits;
  job = getJSON(jobURL);
  jobRuns = getJSON(jobRunsURL);
  // Replace the spaces with a dash, so we can use it in an ID attribute
  var msName = job.name.replace(/\s+/g, '-');

  for (i = 0; i < jobRuns.length; i++) {
    // Find the fist completed run and build a list of the stages in it for reference.
    if (jobRuns[i].status === "SUCCESS") {
      stages = createListOfStages(msName, jobRuns[i].stages);
      break;
    }
  }

  // returns undefined if all stages are successful
  commits = getAllCommits(msName, jobRuns);

  var ms = {
    name: msName,
    stages: stages,
    commits: commits,
    job: jobURL,
    jobRuns: jobRunsURL
  };
  
  if (document.getElementById(msName)) {
    // if this pipeline already exists on the screen then just update it
    updateMicroService(ms);
  } else {
    microServiceRegistry.push(ms);
    addPipelineElement(ms);
  }
}

// Called by pollJenkins
function updateMicroService(ms) {
  var i;
  var jobRuns = getJSON(ms.jobRuns);
  var oldNumberOfStages = ms.stages.length;
  var newNumberOfStages = jobRuns[0].stages.length;
  var oldCommits = JSON.parse(JSON.stringify(ms.commits));

  for (i = 0; i < jobRuns.length; i++) {
    // Get the latest complete list of stages, we need updated times.
    if (jobRuns[i].status === "SUCCESS") {
      ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
      break;
    }
  }

  ms.commits = getAllCommits(ms.name, jobRuns);

  
  // Compare old stages to new to see if they changed. If they changed then update the html.
  if (oldNumberOfStages !== newNumberOfStages) {
    addStagesElement(ms);
    addAllCommitElements(ms);
    // TODO: need to reset position of commits if they are moving/transitioning in the pipeline
  } else {
    updateCommitStatus(ms, oldCommits);
  }
  
  return ms;
}

function getJSON(restURL){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        return JSON.parse(xhr.responseText);
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', restURL, true);
  xhr.send(null);
}

function pollJenkins() {
  for (var i = 0; i < microServiceRegistry.length; i++) {
    microServiceRegistry[i] = updateMicroService(microServiceRegistry[i]);
  }
}

var timer = setInterval(pollJenkins, 500);