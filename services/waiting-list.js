const _waitingLists = { };

function waitingLists() {
    return {..._waitingLists};
}

function waitingList(room) {
    return [..._waitingLists[room] || []]
}

function isWaiting(appointment) {
    return !waitingList(appointment.room._id).every(element => {
        console.log(element._id, appointment._id)
        return !element._id.equals(appointment._id);
    })
}

function addToWaitingList(appointment) {
    if (!isWaiting(appointment)) {
        _waitingLists[appointment.room._id] = [...(_waitingLists[appointment.room._id] || []), appointment];
    }
}

function removeFromWaitingList(appointment) {
    if (appointment) {
        _waitingLists[appointment.room._id].splice(_waitingLists[appointment.room._id].indexOf(appointment), 1);
    }
}

module.exports = {
    waitingLists,
    waitingList,
    isWaiting,
    addToWaitingList,
    removeFromWaitingList
}