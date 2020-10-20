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

        const handleGuestWaiting = async (data) => {
            console.log('new guest waiting', data);
            const appointment = await Appointment.findById(data.appointment_id);
            WaitingListService.addToWaitingList(appointment);
            socket.on('disconnect', handleGuestDisconnect(appointment)) // register cleanup behavior
            socket.to(appointment.room._id).emit('guest:waiting', JSON.stringify(appointment));
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
        const handleGuestDisconnect = (appointment) => {
            return (s) => {
                console.log('guest disconnected');
                WaitingListService.removeFromWaitingList(appointment);
                console.log('current waiting lists', WaitingListService.waitingLists());
                socket.to(appointment.room._id).emit('guest:disconnect', JSON.stringify(appointment));
            }
        }

        socket.on('operator:connected', handleOperatorConnected)
        socket.on('guest:waiting', handleGuestWaiting)
        socket.on('disconnect', handleDisconnect)
    })
}

module.exports = SocketHandler