'use strict';

/**
 *
 *
 * Called by transformProperty
 */
module.exports = function () {
  var properties = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];

  for (var i = 0; i < properties.length; i++) {
    if (typeof document.body.style[properties[i]] != "undefined") {
      return properties[i];
    }
  }
  return null;
};