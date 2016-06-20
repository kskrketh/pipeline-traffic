'use strict';

/**
 Called by index.html but set in addPipelineElement.js
 */
module.exports = function (parentElementID, childElementID) {

  var parent = document.getElementById(parentElementID);
  var child = document.getElementById(childElementID);
  parent.removeChild(child);

  // TODO: remove the URL from jenkinsJobs[]
};