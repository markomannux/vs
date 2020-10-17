import io from 'socket.io-client';

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const appointment_id = $('#appointment_id').val();
    const room_id = $('#room_id').val();
    socket.on('connect', () => {
        socket.emit('guest:waiting', {room_id, appointment_id});
    })
})
