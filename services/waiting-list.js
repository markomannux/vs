const events = require('events')
const _waitingLists = { }
const _currentAppointments = { }
const waitingListEventEmitter = new events.EventEmitter()

function waitingLists() {
    return {..._waitingLists};
}

function waitingList(roomId) {
    return [..._waitingLists[roomId] || []]
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
        waitingListEventEmitter.emit('waitinglist:added', appointment)
    }
}

function removeFromWaitingList(appointment) {
    if (appointment) {
        _waitingLists[appointment.room._id].splice(_waitingLists[appointment.room._id].indexOf(appointment), 1);
        waitingListEventEmitter.emit('waitinglist:removed', appointment)
    }
}

function getCurrentAppointment(room) { 
    return _currentAppointments[room]
}

function setAsCurrentAppointment(appointment) {
    if (appointment) {
        removeFromWaitingList(appointment)
        _currentAppointments[appointment.room._id] = appointment
        waitingListEventEmitter.emit('waitinglist:newcurrent', appointment)
    }
}

function clearCurrentAppointment(roomId) {
    const appointment = _currentAppointments[roomId]
    delete _currentAppointments[roomId]
    waitingListEventEmitter.emit('waitinglist:currentcleared', appointment)
}

module.exports = {
    waitingLists,
    waitingList,
    isWaiting,
    addToWaitingList,
    removeFromWaitingList,
    getCurrentAppointment,
    setAsCurrentAppointment,
    clearCurrentAppointment,
    waitingListEventEmitter
}