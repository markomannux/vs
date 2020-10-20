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
    const event = new CustomEvent('guest:waiting', {key: 'some value'});
    document.dispatchEvent(event);
})

socket.on('guest:disconnect', (data) => {
    console.log(`user leaving`, data);
    const event = new CustomEvent('guest:disconnect', {key: 'some value'});
    document.dispatchEvent(event);
})