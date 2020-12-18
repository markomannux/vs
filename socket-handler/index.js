const Room = require('../model/room');
const User = require('../model/user');
const Appointment = require('../model/appointment');
const WaitingListService = require('../services/waiting-list');
const app = require('../app');

function SocketHandler(io) {

    io.on('connection', socket => {
        console.log('new client connected');

        const handleOperatorConnected = (data) => {
            const sessionData = socket.request.session
            User.findOne({ username: sessionData.passport.user})
            .then(user => {
                user.rooms.forEach(room => {
                    socket.join(room._id);
                })
            })
        }

        let appointment;

        const handleGuestConnected = async (data, fn) => {
            appointment = await Appointment.findById(data.appointment_id);
            socket.join(`${appointment.room._id}:${appointment._id}`);
            if (WaitingListService.isWaiting(appointment)) {
                fn({
                    guestWaitingElsewhere: true
                })
            } else {
                WaitingListService.addToWaitingList(appointment);
                socket.on('disconnect', handleGuestDisconnect) // register cleanup behavior
                fn({
                    guestWaitingElsewhere: false
                })
            }

            socket.on('guest:wait-here', handleWaitHere);
            socket.on('guest:dont-wait-here', handleDontWaitHere);
        }

        const handleWaitHere = async (data, fn) => {
            console.log('guest is changing waiting room');
            socket.on('disconnect', handleGuestDisconnect)
            socket.to(`${appointment.room._id}:${appointment._id}`).emit('guest:waiting-elsewhere');
            fn('ACK');
        }

        const handleDontWaitHere = async (data, fn) => {
            socket.off('disconnect', handleGuestDisconnect)
            fn('ACK');
        }

        /**
         * Generic disconnect behavior 
         * @param {*} s 
         */
        const handleDisconnect = (s) => {
            console.log('socket disconnected');
        }

        /**
         * Disconnect behavior for guests
         * @param {*} appointment 
         */
        const handleGuestDisconnect = (s) => {
            WaitingListService.removeFromWaitingList(appointment);
            if (WaitingListService.getCurrentAppointment(appointment.room._id) === appointment._id)
            WaitingListService.clearCurrentAppointment(appointment.room._id)
        }

        socket.on('operator:connected', handleOperatorConnected)
        socket.on('guest:connected', handleGuestConnected)
        socket.on('disconnect', handleDisconnect)
    })

    this.broadcastGuestWaiting = function(appointment) {
        if (appointment) {
            io.to(appointment.room._id).emit('guest:waiting', JSON.stringify(appointment));
        }
    }

    this.broadcastGuestLeft = function(appointment) {
        if (appointment) {
            io.to(appointment.room._id).emit('guest:disconnect', JSON.stringify(appointment));
        }
    }

    this.broadcastConferenceStarted = function(appointment) {
        if (appointment) {
            io.to(`${appointment.room._id}:${appointment._id}`).emit('conference:start')
        }
    }

    this.broadcastConferenceEnded = function(appointment) {
        if (appointment) {
            io.to(`${appointment.room._id}:${appointment._id}`).emit('conference:end')
        }
    }
}

module.exports = SocketHandler