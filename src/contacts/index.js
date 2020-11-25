import PageController from '../common/page-controller'

export default class ContactsIndexController extends PageController {

    setUp() {
        $('[data-behavior~=add-contact-button]').on("click", function(event) {
            $('[data-behavior~=add-contact-form-container]').toggle()
            $('#fullName').trigger('focus')
        })
    }

    tearDown() {
        $('[data-behavior~=add-contact-form]').hide()
    }
}

