'use strict';

/**
 * taken from https://github.com/Red-Hat-Middleware-Keynote/selfie-mosaic/blob/master/client/app/admin/socket.js
 *
 * Called by app.js
 */
module.exports = function (intervalIsOn) {
  var app = require('./app');

  var selfieMap = {};
  var socketStream = Rx.DOM.fromWebSocket('ws://selfie-mosaic-server-demo.apps-test.redhatkeynote.com/selfie')
    .map(function (messageEvent) {
      return JSON.parse(messageEvent.data);
    })
    .filter(function (messageData) {
      return messageData.type === 'stream';
    })
    .flatMap(function (messageData) {
      return messageData.data.buffer;
    })
    .filter(function (selfie) {
      return !selfieMap[selfie.uid];
    })
    .tap(function (selfie) {
      selfieMap[selfie.uid] = selfie;
      console.log('beep')
    })
    .subscribeOnError(function (err) {
      console.error(err);
    });
}