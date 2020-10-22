const Room = require('../model/room');
const User = require('../model/user');
const Appointment = require('../model/appointment');
const WaitingListService = require('../services/waiting-list');

const SocketHandler = (server) => {

    const io = require('socket.io')(server);

    io.on('connection', socket => {
        console.log('new client connected');

        const handleOperatorConnected = (data) => {
            console.log('new operator connected', data);
            User.findOne({ username: data.operator})
            .then(user => {
                user.rooms.forEach(room => {
                    console.log(`joining room ${room._id}`);
                    socket.join(room._id);
                })
            })
        }

        let appointment;

        const handleGuestConnected = async (data, fn) => {
            console.log('new guest waiting', data);
            appointment = await Appointment.findById(data.appointment_id);
            console.log('Already waiting', WaitingListService.isWaiting(appointment));
            socket.join(appointment.room._id);
            if (WaitingListService.isWaiting(appointment)) {
                fn({
                    guestWaitingElsewhere: true
                })
            } else {
                WaitingListService.addToWaitingList(appointment);
                socket.on('disconnect', handleGuestDisconnect) // register cleanup behavior
                socket.to(appointment.room._id).emit('guest:waiting', JSON.stringify(appointment));
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
            socket.to(appointment.room._id).emit('guest:waiting-elsewhere');
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
            console.log('guest disconnected');
            WaitingListService.removeFromWaitingList(appointment);
            console.log('current waiting lists', WaitingListService.waitingLists());
            socket.to(appointment.room._id).emit('guest:disconnect', JSON.stringify(appointment));
        }

        socket.on('operator:connected', handleOperatorConnected)
        socket.on('guest:connected', handleGuestConnected)
        socket.on('disconnect', handleDisconnect)
    })
}

module.exports = SocketHandler