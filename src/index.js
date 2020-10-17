import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks';
import io from 'socket.io-client';

Rails.start();
Turbolinks.start();
const socket = io();

document.addEventListener('turbolinks:load', (event) => {
    console.log('page loaded', event)
})

socket.emit('operator:connected', {operator: 'test'})

socket.on('guest:waiting', (data) => {
    console.log(`user waiting`, data);
})