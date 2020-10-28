import {fetchRooms} from '../../rooms-service';
console.log('setting up listeners');
document.addEventListener('turbolinks:load', () => {
    const page = $('[name=page]').attr('content')
    console.log('aaaa', page);
    if (page === 'admin-user-detail') {
    console.log('setting unp');
        setUp()
    }
})

function setUp() {
    console.log('setting unp');
    const roomSelect = $('[data-behavior~=room-select]');
    fetchRooms().then(rooms => {
        rooms.forEach(room => {
            const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
            roomSelect.append(option);
        })
    })
}
