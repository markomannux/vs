import PageController from '../common/page-controller'
import {fetchRooms} from '../rooms-service';

export default class ContactDetailController extends PageController {

    setUp() {
        $('[data-behavior~=new-appointment-button]').on('click', () => {
            $('[data-behavior~=new-appointment-form]').toggle()
        })
        
        const roomSelect = $('[data-behavior~=room-select]');
        fetchRooms().then(rooms => {
            rooms.forEach(room => {
                const option = $.parseHTML(`<option value="${room._id}">${room.name}</option>`)
                roomSelect.append(option);
            })
        })
    }
}

