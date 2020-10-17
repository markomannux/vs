const Room = require('../model/room');
const User = require('../model/user');
const Appointment = require('../model/appointment');

const SocketHandler = (server) => {

    const io = require('socket.io')(server);

    const guestLists = { };

    io.on('connection', socket => {
        console.log('new client connected');

        let guest;

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
            console.log('new client waiting', data);
            const appointment = await Appointment.findById(data.appointment_id);
            console.log(appointment.room._id);
            guestLists[appointment.room._id] = [...(guestLists[appointment.room._id] || []), appointment];
            guest = appointment;
            console.log(guestLists);
            socket.to(appointment.room._id).emit('guest:waiting', JSON.stringify(appointment));
        }

        const handleDisconnect = (socket) => {
            console.log('socket disconnected');
            guestLists[guest.room._id].splice(guestLists[guest.room._id].indexOf(guest), 1);
            console.log(guestLists)
        }

        socket.on('operator:connected', handleOperatorConnected)
        socket.on('guest:waiting', handleGuestWaiting)
        socket.on('disconnect', handleDisconnect)

    })
}

module.exports =  SocketHandler