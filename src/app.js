'use strict';

// imports
var particles = require('./particles');

var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
var transformProperty = getSupportedPropertyName(transform);

var jenkinsJobs = [
  //'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example/',
  //'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example-copy1/',
  //'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pipeline-example-copy2/',
  'http://jenkins-jenkins.apps.demo.aws.paas.ninja/job/ci-pipeline/',
  // 'http://jenkins-demo.apps.demo.aws.paas.ninja/job/pending-input/',
  // 'http://jenkins-demo.apps.demo.aws.paas.ninja/job/complicated-steps/',
  // 'http://jenkins-demo.apps.demo.aws.paas.ninja/job/test-api/',
  //'http://jenkins-demo.apps.demo.aws.paas.ninja/job/fail-step/'
];

var addNewJenkinsJob = function() {
  var inputValue = document.getElementById('JenkinsJobURL');
  var jobURL = inputValue.value;
  jenkinsJobs.push(jobURL);
  toggleIntervalOn(false);
  loadJenkinsJob(jobURL);
};

function getJobJSON(restURL){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        return getRunsJSON(restURL + '/runs', JSON.parse(xhr.responseText).name);
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', restURL, true);
  xhr.send(null);
}

function getRunsJSON(restURL, msName){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        return addMicroServiceToRegistry(JSON.parse(xhr.responseText), restURL, msName);
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', restURL, true);
  xhr.send(null);
}

function loadPredefinedJenkinsJobs(jenkinsJobs) {
  for (var i = 0; i < jenkinsJobs.length; i++) {
    loadJenkinsJob(jenkinsJobs[i]);
  }
}

function loadJenkinsJob(jenkinsJob) {
  // TODO: Add a check to make sure it is a URL, Make sure it is not a duplicate of what we already have.
  getJobJSON(jenkinsJob + 'wfapi');
}

loadPredefinedJenkinsJobs(jenkinsJobs);



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

// This was the original way to move the commit within a stage, now it is down via CSS duration feature.
// It is kept here in case we need more control over the movement.
function moveCommits() {
  console.log('moveCommits - start');
  for (var i = 0; i < microServiceRegistry.length; i++) {
    for (var j = 0; j < microServiceRegistry[i].commits.length; j++) {
      var commit = microServiceRegistry[i].commits[j];
      if (commit.status === 'in_progress') {
        if (commit.amountOfStageComplete > 99) {
          continue;
        }
        console.log('commit.id = ' + commit.id + ' | commit.amountOfStageComplete = ' + commit.amountOfStageComplete);
        commit.amountOfStageComplete = commit.amountOfStageComplete + commit.stageMovementInterval;
        var commitDiv = document.getElementById(commit.id);
        if (transformProperty) {
          commitDiv.style[transformProperty] = 'translate3d(' + commit.amountOfStageComplete + '% ,0,0)';
        }
      }
    }
  }
}
//var timer1 = setInterval(moveCommits, 300);

//setTimeout(function() {clearInterval(timer1)}, 8000);





var microServiceRegistry = [];
var stageMovementFactor = 300;
function createCommit(jobName, runId, runName, runStatus, stageId, stageName, stageStatus, duration) {
  console.log('createCommit - id: ' + jobName + '-' + runId + '-' + runName + '-' + stageId);
  console.log('createCommit - duration: ' + duration);
  return {
    id: jobName + '-' + runId + '-' + runName + '-' + stageId,
    runId: runId,
    runName: runName,
    runStatus: runStatus,
    currentStageID: stageId,
    currentStage: stageName,
    status: stageStatus.toLowerCase(),
    duration: duration,
    stageMovementInterval: (stageMovementFactor/duration)*100,
    amountOfStageComplete: 0
  };
}
function getAllCommits(jobName, runs, msStages) {
  console.log('getAllCommits - start');
  var commits = [], stages, i, j;

  for (i = 0; i < runs.length; i++) {
    console.log('getAllCommits - status = ' + runs[i].status);
    if (runs[i].status === 'IN_PROGRESS' || runs[i].status === 'PAUSED_PENDING_INPUT' || runs[i].status === 'NOT_EXECUTED') {
      console.log('getAllCommits - run status = not SUCCESS');
      stages = runs[i].stages;
      for (j = 0; j < stages.length; j++) {
        commits.push(createCommit(jobName, runs[i].id, runs[i].name, runs[i].status, stages[j].id, stages[j].name, stages[j].status, msStages[j].duration));
      }
    }
    if (i===0 && (runs[i].status === 'FAILED' || runs[i].status === 'ABORTED')) {
      // If there are multiple failures we only need to display the latest. 
      console.log('getAllCommits - run status = FAILED or ABORTED');
      stages = runs[i].stages;
      for (j = 0; j < stages.length; j++) {
        commits.push(createCommit(jobName, runs[i].id, runs[i].name, runs[i].status, stages[j].id, stages[j].name, stages[j].status, msStages[j].duration));
      }
      break;
    }
  }
  console.log('getAllCommits - end');
  return commits;
}

// If you can find any completed stages, in a completed run, in the UI then remove them. They should already be hidden.
function removeOldCommits(prevMs, runs) {
  console.log('removeOldCommits - start');
  for (var i = 0; i < runs.length; i++) {
    // TODO: figure out what to do with duplicates for Pending and Fail
    console.log('removeOldCommits - status: ' + runs[i].status);
    if (runs[i].status === "SUCCESS" || (i > 0 && (runs[i].status === "FAILED" || runs[i].status === "ABORTED"))) {
      var stages = runs[i].stages;
      var id = '';
      for (var j = 0; j < stages.length; j++) {
        for (var k = 0; k < prevMs.commits.length; k++) {
          id = prevMs.name + '-' + runs[i].id + '-' + runs[i].name + '-' + stages[j].id;
          if (prevMs.commits[k].id === id) {
            console.log('removeOldCommits - id: ' + id);
            var commitDiv = document.getElementById(id);
            commitDiv.remove();
          }
        }
      }
    }
  }
  console.log('removeOldCommits - end');
}

// Build the HTML for the commit / ball container
function addCommitContainerElement(commit) {
  //console.log('addCommitContainerElement - start');
  var div = document.createElement('div');
  div.id = commit.id;
  div.classList.add('commit-container', commit.status);
  //div.style = 'transform: translate3d(0%, 0, 0);';
  //if (!commit.duration) {commit.duration === 5000};
  div.style = 'animation-duration: ' + commit.duration + 'ms;';
  console.log('addCommitContainerElement - div style string: ' + 'animation-duration: ' + commit.duration + 'ms;');
  console.log('addCommitContainerElement - end');

  return div;
}

// Build the HTML for the commit / ball
function addCommitElement() {
  var div = document.createElement('div');
  div.classList.add('commit');

  return div;
}

// For each commit/ball look up the stage it goes in and then pull that div and add the commit to it.
// This should support multiple commits in one stage.
// This should also support a limited range of stages. (i.e. just new stages)
function addAllCommitElements(commits, stages) {
  //console.log('addAllCommitElements - start');
  for (var j = 0; j < commits.length; j++) {
    for (var k = 0; k < stages.length; k++) {
      if (stages[k].stageID === commits[j].currentStageID) {
        var stageDiv = document.getElementById(stages[k].id);
        //console.log('addAllCommitElements - id: ' + stages[k].id);
        var commitContainer = stageDiv.appendChild(addCommitContainerElement(commits[j]));
        commitContainer.appendChild(addCommitElement());
      }
    }
  }
  //console.log('addAllCommitElements - end');

}

// Compare each commit to the last list of commits. Once you find a match check if the status is different. 
// If the status has changed then change it in the UI.
function updateCommitStatus(ms, prevMs) {
  console.log('updateCommitStatus - start');
  for (var i = 0; i < ms.commits.length; i++) {
    for (var j = 0; j < prevMs.commits.length; j++) {
      if (ms.commits[i].id === prevMs.commits[j].id) {
        if (ms.commits[i].status !== prevMs.commits[j].status) {
          console.log('updateCommitStatus - id: ' + ms.commits[i].id);
          console.log('updateCommitStatus - ms.commits['+ i +'].status = '+ ms.commits[i].status + ' --- prevMs.commits['+ j +'].status = '+ prevMs.commits[j].status);
          var commitDiv = document.getElementById(ms.commits[i].id);
          commitDiv.classList.add(ms.commits[i].status);
          commitDiv.classList.remove(prevMs.commits[j].status);
          if (ms.commits[i].status === 'success' && (ms.stages.slice(-1)[0].stageID === ms.commits[i].stageID)) {
            // Either add a new commit div to the prod stage here OR go add a Prod stage to Stages and Commits
          }
        }
      }
    }
  }
  console.log('updateCommitStatus - end');
}

// Create a model of a stage
function createStage(jobName, stageId, stageName, duration) {
  console.log('createStage - start');
  console.log('createStage - jobName=' + jobName + ', stageId=' + stageId + ', stageName=' + stageName);
  return {
    id: jobName + '-' + 'stage' + '-' + stageId,
    stageID: stageId,
    name: stageName,
    msName: jobName,
    duration: duration
  };
}

// Build a model of all of the stages in a run
function createListOfStages(jobName, runStages) {
  console.log('createListOfStages - start');
  var stages = [];
  for (var i = 0; i < runStages.length; i++) {
    var duration = runStages[i].durationMillis - runStages[i].pauseDurationMillis;
    if (duration < 200) {duration=5000;}
    console.log('createListOfStages - ' + jobName + ' ' + runStages[i].name + ' duration = ' + duration);
    stages.push(createStage(jobName, runStages[i].id, runStages[i].name, duration));
  }
  console.log('createListOfStages - end');

  return stages;
}

// For a given pipeline, add all the stages to the UI.
function addStagesElement(ms) {
  console.log('addStagesElement - start');
  var stages = document.getElementById(ms.name + '-stages');
  var html = '';

  for (var i = 0; i < ms.stages.length; i++) {
    html +=
      '<div id="' + ms.stages[i].id + '" class="stage">' +
      '<h2>' + ms.stages[i].name + '</h2>' +
      '</div><!-- /stage -->';
  }

  stages.innerHTML = html;
  console.log('addStagesElement - end');

}

// For a given Job / MicroService add it to the UI.
function addPipelineElement(ms) {
  console.log('addPipelineElement - start');
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
    '<div id="' + ms.name + '-prod-1" class="commit-container" style="animation-duration: 2s;">' +
    '<div class="commit"></div>' +
    '</div>' +
    '</div><!-- /stage-lg -->';

  pipeline.appendChild(div);
  addStagesElement(ms);
  addAllCommitElements(ms.commits, ms.stages);
  console.log('addPipelineElement - end');

}

// This is the initial creation of the pipelines and should only be called on page load.
function addMicroServiceToRegistry(runJSON, restURL, msName) {
  console.log('addMicroServiceToRegistry - start');
  var i, stages, commits;
  var latestRuns = [];
  var statusIsSuccess = false;
  var foundSuccessfulStage = false;

  // Build a smaller list of Job Runs so we don't have deal with the whole thing.
  for (i = 0; i < runJSON.length; i++) {
    latestRuns.push(runJSON[i]);
    // Look for a Successful Run if it can be found. 
    if (runJSON[i].status === "SUCCESS") {
      statusIsSuccess = true;
    }
    if (statusIsSuccess && i > 2) {
      break;
    }
  }

  // Get the latest complete list of stages, we need updated times. Search all the Runs we have looking for last Successful one.
  for (i = 0; i < runJSON.length; i++) {
    if (runJSON[i].status === "SUCCESS" ) {
      stages = createListOfStages(msName, runJSON[i].stages);
      foundSuccessfulStage = true;
      break;
    }
  }

  // If no successful runs were found then use the 2nd failed or aborted one.
  if (!foundSuccessfulStage) {
    for (i = 0; i < runJSON.length; i++) {
      if (i > 0 && (runJSON[i].status === "FAILED" || runJSON[i].status === "ABORTED")) {
        stages = createListOfStages(msName, runJSON[i].stages);
        foundSuccessfulStage = false;
        break;
      }
    }
  }

  // returns undefined if all stages are successful
  commits = getAllCommits(msName, latestRuns, stages);

  var ms = {
    name: msName,
    stages: stages,
    commits: commits,
    jobRuns: restURL
  };

  if (document.getElementById(msName)) {
    // if this pipeline already exists on the screen then just update it
    updateMicroService(ms);
  } else {
    microServiceRegistry.push(ms);
    addPipelineElement(ms);
  }

  // In case we turn off the Interval, this will turn it back on.
  toggleIntervalOn(true);
  console.log('addMicroServiceToRegistry - end');
}

// Called by pollJenkins
// This is how we know when a new Run happens and update the UI with it.
function updateMicroService(ms, jobRuns) {
  console.log('updateMicroService - start ' + ms.name + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  var i,j;
  var oldNumberOfStages = ms.stages.length;
  var newNumberOfStages;
  var prevMs = JSON.parse(JSON.stringify(ms)); // deep-copy commits
  var commitsToAdd = [];
  var latestRuns = [];
  var statusIsSuccess = false;
  var foundSuccessfulStage = false;

  // Build a smaller list of Job Runs so we don't have deal with the whole thing.
  for (i = 0; i < jobRuns.length; i++) {
    latestRuns.push(jobRuns[i]);
    // Look for a Successful Run if it can be found. 
    if (jobRuns[i].status === "SUCCESS") {
      statusIsSuccess = true;
    }
    if (statusIsSuccess && i > 2) {
      break;
    }
  }

  // Get the latest complete list of stages, we need updated times. Search all the Runs we have looking for last Successful one.
  for (i = 0; i < jobRuns.length; i++) {
    if (jobRuns[i].status === "SUCCESS" ) {
      newNumberOfStages = jobRuns[i].stages.length;
      ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
      foundSuccessfulStage = true;
      break;
    }
  }

  // If no successful runs were found then use the 2nd failed or aborted one.
  if (!foundSuccessfulStage) {
    for (i = 0; i < jobRuns.length; i++) {
      if (i > 0 && (jobRuns[i].status === "FAILED" || jobRuns[i].status === "ABORTED")) {
        newNumberOfStages = jobRuns[i].stages.length;
        ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
        foundSuccessfulStage = false;
        break;
      }
    }
  }

  //TODO: what if first run and no stages exist?

  // Get all the currently active Job Runs, not just the latest
  ms.commits = getAllCommits(ms.name, latestRuns, ms.stages);

  // Get a list of the commits that have just been added
  for (i = 0; i < ms.commits.length; i++) {
    var foundMatchingCommit = false;
    for (j = 0; j < prevMs.commits.length; j++) {
      console.log('updateMicroService - Comparing ms.commits['+ i +'].id = '+ ms.commits[i].id + ' to prevMs.commits['+ j +'].id = '+ prevMs.commits[j].id);
      if (ms.commits[i].id == prevMs.commits[j].id) {
        foundMatchingCommit = true;
      }
    }
    if (!foundMatchingCommit) {
      console.log('updateMicroService - Adding ms.commits['+ i +'].id = '+ ms.commits[i].id);
      commitsToAdd.push(ms.commits[i])
    }
  }


  // Compare old stages to new to see if they changed. If they changed then update the html.
  if (oldNumberOfStages !== newNumberOfStages) {
    addStagesElement(ms);
    addAllCommitElements(ms.commits, ms.stages);
    // TODO: need to reset position of commits if they are moving/transitioning in the pipeline
  } else {
    updateCommitStatus(ms, prevMs);
    removeOldCommits(prevMs, latestRuns);
    if (commitsToAdd.length > 0) {
      addAllCommitElements(commitsToAdd, ms.stages);
    }
  }
  console.log('updateMicroService - end>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

  return ms;
}

function getRunsJSONUpdates(microServiceToBeUpdated){
  //console.log('getRunsJSONUpdates - start');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        return microServiceToBeUpdated = updateMicroService(microServiceToBeUpdated, JSON.parse(xhr.responseText));
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', microServiceToBeUpdated.jobRuns, true);
  xhr.send(null);
  //console.log('getRunsJSONUpdates - end');

}

function pollJenkins() {
  console.log('pollJenkins - start =====================================================================================');
  for (var i = 0; i < microServiceRegistry.length; i++) {
    getRunsJSONUpdates(microServiceRegistry[i]);
  }
}

var timer;

function toggleIntervalOn(intervalIsOn) {
  if (intervalIsOn) {
    timer = setInterval(pollJenkins, 2000);
  } else {
    clearInterval(timer);
  }
}

toggleIntervalOn(true);

module.exports = {
  addNewJenkinsJob: addNewJenkinsJob
};

