import {fetchRooms} from '../rooms-service';

document.addEventListener('turbolinks:load', () => {
    const page = $('[name=page]').attr('content')
    if (page === 'contact-detail') {
        setUp()
    }
})

function setUp() {
    console.log('setup contact-detail');

    $('[data-behavior~=new-appointment-button]').on('click', () => {
        $('[data-behavior~=new-appointment-form]').toggle()
    })
    
    const roomSelect = $('[data-behavior~=room-select]');
    fetchRooms().then(rooms => {
        rooms.forEach(room => {
            const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
            roomSelect.append(option);
        })
    })
}
