const User = require('../model/user');
const Room = require('../model/room');

async function init() {

    const testUser = await User.findOne(
        { username: 'test'}
    )

    if (!testUser) {

        User.create({
            username: 'test',
            name: 'Test',
            rooms: await Room.create([
                { name: 'Room 1'},
                { name: 'Room 2'}
            ])
        })
    }
}

init();