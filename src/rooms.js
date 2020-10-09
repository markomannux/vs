import fetchRooms from './rooms-service';

document.addEventListener("turbolinks:load", function() {

    const roomSelect = $('#room-select');
    if (roomSelect) {
        fetchRooms().then(rooms => {
            rooms.forEach(room => {
                const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
                roomSelect.append(option);
            })
        })
    }
});
