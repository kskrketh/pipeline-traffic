var Ractive = require('ractive');
var ReconnectingWebSocket = require('reconnectingwebsocket');

// WebSocket init

var socket = new ReconnectingWebSocket("ws://localhost:3003/record");
window.addEventListener('beforeunload', function() {
    socket.close();
});
window.socket = socket;


// Data and UI init

var data = {
    bluegreen_services: [
        'gamebus',
        'score',
        'achievements',
    ],
    state: {
        bluegreen: {
            gamebus      : 'blue',
            score        : 'green',
            achievements : 'blue',
        },
        volume: 0,
        phase: 'game',
    }
};

var ractive = new Ractive({
    el       : document.querySelector('#container'),
    template : document.querySelector('#template').textContent,
    data     : data,
});

ractive.on( 'set-bluegreen', function ( event ) {
    var btn_info = event.node.id.split('-');
    var key = 'state.bluegreen.' + btn_info[0];
    ractive.set(key, btn_info[1]);
});

ractive.on( 'set-phase-game', () => ractive.set('state.phase', 'game'));
ractive.on( 'set-phase-player-id', () => ractive.set('state.phase', 'player-id'));
ractive.on( 'set-volume', event => ractive.set('state.volume', event.node.value));

window.ractive = ractive;

function traffic(from, to) {
    socket.send(JSON.stringify({from: from, to: to}));
}

function tickGamePhase() {
    if (Math.random()*100 < data.state.volume) {
        traffic('public'      , 'gamebus');
        traffic('gamebus'     , 'score');
        traffic('gamebus'     , 'achievement');
        traffic('score'       , 'gamebus');
        traffic('achievement' , 'gamebus');
    }
}

function tickPlayerIDPhase() {
    if (Math.random()*100 < data.state.volume) {
        traffic('public', 'playerid');
    }
}

function tickMechanics() {
    tickMechanics.count = tickMechanics.count ? tickMechanics.count + 1 : 1;
    if (tickMechanics.count >= 100) {
        tickMechanics.count = 0;
        traffic('mechanics', 'gamebus');
    }
}

function tick() {
    requestAnimationFrame(tick);

    switch (data.state.phase) {
        case 'game':
            tickGamePhase();
            tickMechanics();
            break;

        case 'player-id':
            tickPlayerIDPhase();
            break;

        default:
            // code ...
    }
}

tick();
