'use strict';

/**
 Called by compressPipeline.js and expandPipeline.js
 */
module.exports = function (elementID) {

  var msElement = document.getElementById(elementID);
  var msClassList = msElement.classList;
  for (var i = 0; i < msClassList.length; i++) {
    var myRe = new RegExp("microservice-large-\\d+");
    var myArray = myRe.exec(msClassList[i]);
    if(myArray) {msElement.classList.remove(myArray[0]);}
  }
};