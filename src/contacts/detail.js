import PageController from '../common/page-controller'
import {fetchRooms} from '../rooms-service';

export default class ContactDetailController extends PageController {

    setUp() {
        $('[data-behavior~=new-appointment-button]').on('click', () => {
            $('[data-behavior~=add-appointment-form-container]').toggle()
        })
    }
}

