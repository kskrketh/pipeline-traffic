var MECHANICS_TICK_RATE = 4; // how often mechanics -> gamebus traffic is sent
var TRAFFIC_PER_FRAME = 2;

var Ractive = require('ractive');
var ReconnectingWebSocket = require('reconnectingwebsocket');

// WebSocket init

var socket = new ReconnectingWebSocket("ws://gamebus-traffic-production.apps-test.redhatkeynote.com/record");

window.addEventListener('beforeunload', function() {
    socket.close();
});
window.socket = socket;


// Data and UI init

var data = {
    services: [
        'gamebus',
        'score',
        'achievement',
        'mechanics',
    ],
    state: {
        active: {
            gamebus     : 'blue',
            score       : 'blue',
            achievement : 'blue',
            mechanics   : 'live',
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

ractive.on( 'set-active', function ( event ) {
    var btn_info = event.node.id.split('-');
    var key = 'state.active.' + btn_info[0];
    ractive.set(key, btn_info[1]);
});

ractive.on( 'set-phase-game', () => ractive.set('state.phase', 'game'));
ractive.on( 'set-phase-player-id', () => ractive.set('state.phase', 'player-id'));
ractive.on( 'set-volume', event => ractive.set('state.volume', event.node.value));

window.ractive = ractive;

function traffic(from, to) {
    socket.send(JSON.stringify({from: from, to: to}));
}

function id(name) {
    return `${name}-pipeline-${data.state.active[name] || 'live'}`;
}

function tickGamePhase() {
    var i = TRAFFIC_PER_FRAME;
    while(i--) {
        if (Math.random()*100 < data.state.volume) {
            traffic(id('public')      , id('gamebus'));
            traffic(id('gamebus')     , id('score'));
            traffic(id('gamebus')     , id('achievement'));
            traffic(id('score')       , id('gamebus'));
            traffic(id('achievement') , id('gamebus'));
        }
    }
}

function tickPlayerIDPhase() {
    if (Math.random()*100 < data.state.volume) {
        traffic(id('public'), id('playerid'));
    }
}

function tickMechanics() {
    tickMechanics.count = tickMechanics.count ? tickMechanics.count + 1 : 1;
    if (tickMechanics.count >= MECHANICS_TICK_RATE) {
        tickMechanics.count = 0;

        var p = 1; // percentage of traffic going to 'live'
        if (data.state.active.mechanics === 'canary') {
            p = 0.9;
        }

        if (Math.random() < p) {
            traffic('mechanics-pipeline-live', id('gamebus'));
        }
        else {
            traffic('mechanics-pipeline-canary', id('gamebus'));
        }
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
