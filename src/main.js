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

function createCommit(jobName, runId, runName, stageId, stageName, stageStatus, duration) {
  return {
    id: jobName + '-' + runId + '-' + runName,
    currentStageID: stageId,
    currentStage: stageName,
    status: stageStatus,
    runTime: duration
  };
}
function getCommit(jobName, run) {
  var i, commit, stages, runId, runName;
  stages = run[0].stages;
  runId = run[0].id;
  runName = run[0].name;

  for (i = 0; i < stages.length; i++) {
    if (stages[stages.length - 1].status === "SUCCESS") {
      commit = createCommit(jobName, runId, runName, stages[stages.length - 1].id, stages[stages.length - 1].name, stages[stages.length - 1].status, stages[stages.length - 1].durationMillis);
      break;
    } else if (stages[i].status !== "SUCCESS") {
      commit = createCommit(jobName, runId, runName, stages[i].id, stages[i].name, stages[i].status, stages[i].durationMillis);
      break;
    }
  }

  return commit;
}

function createStage(jobName, stageId, stageName, duration) {
  return {
    id: stageId,
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


function addMicroServiceToRegistry(jobURL, jobRunsURL) {
  var i, stages, job, jobRuns, commit;
  job = getJob(jobURL);
  jobRuns = getRuns(jobRunsURL);
  var msName = job.name;

  for (i = 0; i < jobRuns.length; i++) {
    if (jobRuns[i].status === "SUCCESS") {
      stages = createListOfStages(msName, jobRuns[i].stages);
    }
  }

  if (jobRuns[0].status !== "SUCCESS") {
    commit = getCommit(msName, jobRuns);
  }

  var ms = {
    name: msName,
    stages: stages,
    commit: commit,
    job: jobURL,
    jobRuns: jobRunsURL
  };
  microServiceRegistry.push(ms);
}

// Called by pollJenkins
function updateMicroService(ms) {
  var i, stages, jobRuns, commit;
  jobRuns = getRuns(ms.jobRuns);

  for (i = 0; i < jobRuns.length; i++) {
    if (jobRuns[i].status === "SUCCESS") {
      ms.stages = createListOfStages(ms.name, jobRuns[i].stages);
    }
  }

  ms.commit = getCommit(ms.name, jobRuns);

  return ms;
}

// IF we want to display multiple commits in a pipeline then we would need this to display more then one at a time.
function addCommitElement(msName, msBuild, stage, sha) {
  var div = document.createElement('div');
  div.id = msName + '-' + msBuild;
}

var jobExample = {
  "_links": {
    "self": {
      "href": "/jenkins/job/Test%20Workflow/wfapi/describe"
    },
    "runs": {
      "href": "/jenkins/job/Test%20Workflow/wfapi/runs"
    }
  },
  "name": "Test Workflow",
  "runCount": 17
};

function getJob(restURL){
  // use GET /job/:job-name/wfapi
  return jobExample;
}
var runsExample = [
  {
    "_links": {
      "self": {
        "href": "/jenkins/job/Test%20Workflow/16/wfapi/describe"
      },
      "pendingInputActions": {
        "href": "/jenkins/job/Test%20Workflow/16/wfapi/pendingInputActions"
      }
    },
    "id": "2014-10-16_13-07-52",
    "name": "#16",
    "status": "PAUSED_PENDING_INPUT",
    "startTimeMillis": 1413461275770,
    "endTimeMillis": 1413461285999,
    "durationMillis": 10229,
    "stages": [
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/16/execution/node/5/wfapi/describe"
          }
        },
        "id": "5",
        "name": "Build",
        "status": "SUCCESS",
        "startTimeMillis": 1413461275770,
        "durationMillis": 5228
      },
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/16/execution/node/8/wfapi/describe"
          }
        },
        "id": "8",
        "name": "Test",
        "status": "SUCCESS",
        "startTimeMillis": 1413461280998,
        "durationMillis": 4994
      },
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/16/execution/node/10/wfapi/describe"
          }
        },
        "id": "10",
        "name": "Deploy",
        "status": "PAUSED_PENDING_INPUT",
        "startTimeMillis": 1413461285992,
        "durationMillis": 7
      }
    ]
  },
  {
    "_links": {
      "self": {
        "href": "/jenkins/job/Test%20Workflow/15/wfapi/describe"
      },
      "artifacts": {
        "href": "/jenkins/job/Test%20Workflow/15/wfapi/artifacts"
      }
    },
    "id": "2014-10-16_12-45-06",
    "name": "#15",
    "status": "SUCCESS",
    "startTimeMillis": 1413459910289,
    "endTimeMillis": 1413459937070,
    "durationMillis": 26781,
    "stages": [
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/15/execution/node/5/wfapi/describe"
          }
        },
        "id": "5",
        "name": "Build",
        "status": "SUCCESS",
        "startTimeMillis": 1413459910289,
        "durationMillis": 6754
      },
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/15/execution/node/8/wfapi/describe"
          }
        },
        "id": "8",
        "name": "Test",
        "status": "SUCCESS",
        "startTimeMillis": 1413459917043,
        "durationMillis": 4998
      },
      {
        "_links": {
          "self": {
            "href": "/jenkins/job/Test%20Workflow/15/execution/node/10/wfapi/describe"
          }
        },
        "id": "10",
        "name": "Deploy",
        "status": "SUCCESS",
        "startTimeMillis": 1413459922041,
        "durationMillis": 15029
      }
    ]
  }
];
function getRuns(restURL){
  // use GET /job/:job-name/wfapi/runs
  return runsExample;
}

addMicroServiceToRegistry(getJob('url'), getRuns('url'));

function pollJenkins() {
  for (var i = 0; i < microServiceRegistry.length; i++) {
    microServiceRegistry[i] = updateMicroService(microServiceRegistry[i]);
  }
}

var timer = setInterval(pollJenkins, 500);