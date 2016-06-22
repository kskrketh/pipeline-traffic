'use strict';

/**
 *
 *
 * Called by app.js
 */
module.exports = function (jenkinsJobs) {
  var app = require('./app');

  var pipeline = document.getElementById("pipeline-container");
  var listOfMSNames = [];
  for(var i=0; i < jenkinsJobs.length; i++) {
    listOfMSNames.push(jenkinsJobs[i].match(/\/job\/(.*)?\//)[1]);
    var div = document.createElement('div');
    div.id = "microservice-" + i;
    div.classList.add('microservice-parent');
    div.setAttribute('ondrop', 'app.drop(event)');
    div.setAttribute('ondragover', 'app.allowDrop(event)');
    pipeline.appendChild(div);
  }

  return listOfMSNames;
};