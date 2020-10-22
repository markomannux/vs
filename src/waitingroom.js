import io from 'socket.io-client';

const socket = io();
let waitHere = true;

document.addEventListener('DOMContentLoaded', () => {
    const appointment_id = $('#appointment_id').val();
    const room_id = $('#room_id').val();

    function setWaitingElsewhere() {
        console.log('Guest is waiting on another page')        
        waitHere = false;
        $('#already-waiting').show();
    }

    $('#already-waiting').hide();

    socket.on('guest:waiting-elsewhere', () => {
        socket.emit('guest:dont-wait-here', null, (data) => {
            setWaitingElsewhere()
        })
    })

    socket.on('connect', () => {
        socket.emit('guest:connected', {room_id, appointment_id}, (data) => {
            console.log(data)
            if (data.guestWaitingElsewhere) {
                setWaitingElsewhere();
            }
        });
    })

    $('#wait-here').on('click', (event) => {
        socket.emit('guest:wait-here', null, (data) => {
            waitHere = true;
            $('#already-waiting').hide();
        })
    })

})
