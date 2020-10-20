import fetchRooms from './rooms-service';

const roomSelect = $('[data-behavior~=room-select]');
fetchRooms().then(rooms => {
    rooms.forEach(room => {
        const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
        roomSelect.append(option);
    })
})
