import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks'
import './utils/turbolinks-monkeypatch'
import SocketBus from './socket-handler/index';

import ContactsIndexController from './contacts/index'
import ContactDetailController from './contacts/detail'
import CalendarIndexController from './calendar/index'
import RoomDetailController from './rooms/detail'

import css from './style.css'

Rails.start();
Turbolinks.start();
SocketBus.start()

SocketBus.socket.on('connect', () => {
    SocketBus.socket.emit('operator:connected')
})

new ContactsIndexController('contacts-index')
new ContactDetailController('contact-detail')
new CalendarIndexController('calendar-index')
new RoomDetailController('room-detail')