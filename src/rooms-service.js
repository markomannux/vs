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

function fetchWaitingListHTML(roomId) {
    console.log('service', roomId)
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    return fetch(`/rooms/${roomId}/fragments/waitingList`, requestOptions)
    .then(response => response.text())
};

export {
    fetchRooms,
    fetchWaitingListHTML
}