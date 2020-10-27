import io from 'socket.io-client';

let SocketBus;
if (window._SocketBus) {
    SocketBus = window._SocketBus;
} else {
    SocketBus = {
        start: function() {
            console.log('Start')
            this.socket = io();
            window._SocketBus = this
        }
    }
}


export default SocketBus;