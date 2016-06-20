'use strict';

/**
Called by pollJenkins.js
*/
module.exports = function (microServiceToBeUpdated) {
  var updateMicroService = require('./updateMicroService');

  //console.log('getRunsJSONUpdates - start');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        // console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        return microServiceToBeUpdated = updateMicroService(microServiceToBeUpdated, JSON.parse(xhr.responseText));
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', microServiceToBeUpdated.jobRuns, true);
  xhr.send(null);
  //console.log('getRunsJSONUpdates - end');
};