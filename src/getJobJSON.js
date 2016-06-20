'use strict';

/**
 *This uses the REST API at https://github.com/jenkinsci/pipeline-stage-view-plugin/tree/master/rest-api#get-jobjob-namewfapi
 * It returns the Name and description of the Jenkins Job.
 *
 * Called by loadJenkinsJob.js
 */
module.exports = function (restURL) {
  var getRunsJSON = require('./getRunsJSON');

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
};