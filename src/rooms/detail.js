import {fetchWaitingListHTML} from '../rooms-service'
import SocketBus from '../socket-handler/index';


const handleWaitingListEvent = () => {
    const roomId = $('[name=room-id]').attr('content')
    console.log('guest waiting', roomId);
    fetchWaitingListHTML(roomId)
    .then(result => $('[data-behavior~=waiting-list]').html(result))
    .catch(error => console.log('error', error));
}

const setUp = () => {
    SocketBus.socket.on('guest:waiting', handleWaitingListEvent)
    SocketBus.socket.on('guest:disconnect', handleWaitingListEvent)
}

const tearDown = () => {
    SocketBus.socket.off('guest:waiting', handleWaitingListEvent)
    SocketBus.socket.off('guest:disconnect', handleWaitingListEvent)
}

document.addEventListener('turbolinks:before-render', () => {
    tearDown();
})

// Called once after the initial page has loaded
document.addEventListener( 'turbolinks:load', () => {
    const page = $('[name=page]').attr('content')
    console.log(page)
    if (page === 'room-detail') {
        setUp()
    }
});
