function fetchRooms() {
    var requestOptions = {
        method: 'GET',
        headers: {
            "accept": "application/json"
        }
    }

    return fetch("/rooms", requestOptions)
    .then(res => {
        return res.json();
    })
}

function fetchCurrentAppointmentHTML(roomId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    return fetch(`/rooms/${roomId}/fragments/current`, requestOptions)
    .then(response => response.text())
};

function fetchWaitingListHTML(roomId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    return fetch(`/rooms/${roomId}/fragments/waitingList`, requestOptions)
    .then(response => response.text())
};

export {
    fetchRooms,
    fetchCurrentAppointmentHTML,
    fetchWaitingListHTML
}