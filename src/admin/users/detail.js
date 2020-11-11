import PageController from '../../common/page-controller'
import {fetchRooms} from '../../rooms-service';

class UserDetailController extends PageController {

    setUp() {
        const roomSelect = $('[data-behavior~=room-select]');
        fetchRooms().then(rooms => {
            rooms.forEach(room => {
                const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
                roomSelect.append(option);
            })
        })
    }

}

new UserDetailController('admin-user-detail')