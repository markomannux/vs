import io from 'socket.io-client';
import Appointment from '../model/appointment';

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const appointment_id = $('#appointment_id').val();
    const room_id = $('#room_id').val();
    socket.emit('waiting', {room_id, appointment_id});
})
