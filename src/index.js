import io from 'socket.io-client';
import Turbolinks from 'turbolinks';

Turbolinks.start();

var socket;
document.addEventListener("turbolinks:load", function() {
    if (!socket) {
        socket = io()
    }
});