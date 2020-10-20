const _waitingLists = { };

function waitingLists() {
    return {..._waitingLists};
}

function waitingList(room) {
    return [..._waitingLists[room] || []]
}

function addToWaitingList(appointment) {
    _waitingLists[appointment.room._id] = [...(_waitingLists[appointment.room._id] || []), appointment];
}

function removeFromWaitingList(appointment) {
    if (appointment) {
        _waitingLists[appointment.room._id].splice(_waitingLists[appointment.room._id].indexOf(appointment), 1);
    }
}

module.exports = {
    waitingLists,
    waitingList,
    addToWaitingList,
    removeFromWaitingList
}