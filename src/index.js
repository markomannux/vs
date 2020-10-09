import io from 'socket.io-client';
import Turbolinks from 'turbolinks';
import * as ujs from './rails-ujs';

Turbolinks.start();

var socket;
document.addEventListener("turbolinks:load", function() {
    if (!socket) {
        socket = io()
    }
});