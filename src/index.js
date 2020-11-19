import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks'
import SocketBus from './socket-handler/index';
import './contacts/index'
import './contacts/detail'
import './calendar/index'
//import './waitingroom'
import './rooms/detail'

import css from './style.css'

// Monkey patch Turbolinks to render 403, 404 & 500 normally
// See https://github.com/turbolinks/turbolinks/issues/179
Turbolinks.HttpRequest.prototype.requestLoaded = function() {
  return this.endRequest(function() {
    var code = this.xhr.status;
    if (200 <= code && code < 300 ||
        code === 403 || code === 404 || code === 500) {
      this.delegate.requestCompletedWithResponse(
          this.xhr.responseText,
          this.xhr.getResponseHeader("Turbolinks-Location"));
    } else {
      this.failed = true;
      this.delegate.requestFailedWithStatusCode(code, this.xhr.responseText);
    }
  }.bind(this));
};

Rails.start();
Turbolinks.start();
SocketBus.start()


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