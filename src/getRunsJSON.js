'use strict';

/**
 * This uses the REST API at https://github.com/jenkinsci/pipeline-stage-view-plugin/tree/master/rest-api#get-jobjob-namewfapiruns
 * It returns the Run History of the Jenkins Job.
 *
 * Called by getJobJSON.js
 */
module.exports = function (restURL, msName) {
  var addMicroServiceToRegistry = require('./addMicroServiceToRegistry');

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("xhr succeeded: " + xhr.status + ' results: ' + xhr.responseText);
        addMicroServiceToRegistry(JSON.parse(xhr.responseText), restURL, msName);
      } else {
        console.log("xhr failed: " + xhr.status);
      }
    }
  };
  xhr.open('get', restURL, true);
  xhr.send(null);
};