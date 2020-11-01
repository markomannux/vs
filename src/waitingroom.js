import io from 'socket.io-client';
import * as viewer from './kinesis/viewer'

const socket = io();
let waitHere = true;

function onStatsReport() {
    // Stats here
}

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

    socket.on('conference:start', () => {
        const localView = $('video')[0];
        const remoteView = $('video')[1];

        viewer.startViewer(localView, remoteView, onStatsReport, event => {
            remoteMessage.append(`${event.data}\n`);
        });
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
