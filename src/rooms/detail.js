import PageController from '../common/page-controller'
import {fetchWaitingListHTML, fetchCurrentAppointmentHTML} from '../rooms-service'
import {endAppointment, startAppointment} from '../appointment-service'
import SocketBus from '../socket-handler/index';

export default class RoomDetailController extends PageController {

    handleWaitingListEvent() {
        const roomId = $('[name=room-id]').attr('content')

        fetchWaitingListHTML(roomId)
        .then(result => $('[data-behavior~=waiting-list]').html(result))
        .catch(error => console.log('error', error));

        fetchCurrentAppointmentHTML(roomId)
        .then(result => $('[data-behavior~=current]').html(result))
        .catch(error => console.log('error', error));
    }

    setUp() {
        SocketBus.socket.on('guest:waiting', this.handleWaitingListEvent)
        SocketBus.socket.on('guest:disconnect', this.handleWaitingListEvent)

        const cb = this.handleWaitingListEvent
        $('[data-behavior~=waiting-list]').on("click", 'button[data-behavior~=guest-join-button]', async function(event) {
            const appointment = $(this).data('appointment')
            await startAppointment(appointment)
            cb()
        })

        $('[data-behavior~=current]').on("click", 'button[data-behavior~=guest-terminate-button]', async function(event) {
            const appointment = $(this).data('appointment')
            await endAppointment(appointment)
            cb()
        })
    }

    tearDown() {
        SocketBus.socket.off('guest:waiting', this.handleWaitingListEvent)
        SocketBus.socket.off('guest:disconnect', this.handleWaitingListEvent)
    }
}
