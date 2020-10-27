import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks';
import SocketBus from './socket-handler/index';

Rails.start();
Turbolinks.start();
SocketBus.start()

document.addEventListener('turbolinks:load', (event) => {
    // noop
})

SocketBus.socket.on('connect', () => {
    SocketBus.socket.emit('operator:connected', {operator: 'test'})
})

SocketBus.socket.on('guest:waiting', (data) => {
    console.log(`user waiting`, data);
    const event = new CustomEvent('guest:waiting', {key: 'some value'});
    document.dispatchEvent(event);
})

SocketBus.socket.on('guest:disconnect', (data) => {
    console.log(`user leaving`, data);
    const event = new CustomEvent('guest:disconnect', {key: 'some value'});
    document.dispatchEvent(event);
})