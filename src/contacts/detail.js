import PageController from '../common/page-controller'
import {fetchRooms} from '../rooms-service';

export default class ContactDetailController extends PageController {

    setUp() {
        const editSwitch = $('[data-behavior~=edit-contact-switch]')
        const cancelEditSwitch = $('[data-behavior~=cancel-edit-contact-switch]')

        $('[data-behavior~=new-appointment-button]').on('click', () => {
            $('[data-behavior~=add-appointment-form-container]').toggle()
        })
        editSwitch.on('click', (event) => {
            event.preventDefault()
            this.toggleContactDetail()
        })
        cancelEditSwitch.on('click', (event) => {
            event.preventDefault()
            this.toggleContactDetail()
        })
        $('[data-behavior~=contact-data-container]').on('mouseover', () => {
            editSwitch.show()
        })
        $('[data-behavior~=contact-data-container]').on('mouseout', () => {
            editSwitch.hide()
        })
    }

    toggleContactDetail() {
        $('[data-behavior~=contact-edit-form-container]').toggle()
        $('[data-behavior~=contact-data]').toggle()
    }
    
}

