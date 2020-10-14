import io from 'socket.io-client';
import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks';

Rails.start();
Turbolinks.start();

var socket;
document.addEventListener("turbolinks:load", function() {
    if (!socket) {
        socket = io()
    }
});