import PageController from '../common/page-controller'

class ContactsIndexController extends PageController {

    setUp() {
        $('[data-behavior~=add-contact-button]').on("click", function(event) {
            $('[data-behavior~=add-contact-form]').toggle()
            $('#fullName').trigger('focus')
        })
    }

    tearDown() {
        $('[data-behavior~=add-contact-form]').hide()
    }
}

new ContactsIndexController('contacts-index')
