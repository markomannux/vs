import PageController from '../common/page-controller'
import {fetchWaitingListHTML} from '../rooms-service'
import SocketBus from '../socket-handler/index';

export default class RoomDetailController extends PageController {

    handleWaitingListEvent() {
        const roomId = $('[name=room-id]').attr('content')
        console.log('guest waiting', roomId);
        fetchWaitingListHTML(roomId)
        .then(result => $('[data-behavior~=waiting-list]').html(result))
        .catch(error => console.log('error', error));
    }

    setUp() {
        SocketBus.socket.on('guest:waiting', this.handleWaitingListEvent)
        SocketBus.socket.on('guest:disconnect', this.handleWaitingListEvent)

        $('[data-behavior~=waiting-list]').on("click", 'button[data-behavior~=guest-join-button]', function(event) {
            const appointment = $(this).data('appointment')
            SocketBus.socket.emit('operator:let-guest-enter', {appointment: appointment})
        })
    }

    tearDown() {
        SocketBus.socket.off('guest:waiting', this.handleWaitingListEvent)
        SocketBus.socket.off('guest:disconnect', this.handleWaitingListEvent)
    }
}
