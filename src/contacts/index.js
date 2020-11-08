const setUp = () => {
    $('[data-behavior~=add-contact-button]').on("click", function(event) {
     $('[data-behavior~=add-contact-form]').toggle()
     $('#fullName').trigger('focus')
    })
}

const tearDown = () => {
    $('[data-behavior~=add-contact-form]').hide()
}

document.addEventListener('turbolinks:before-render', () => {
    tearDown();
})

// Called once after the initial page has loaded
document.addEventListener( 'turbolinks:load', () => {
    const page = $('[name=page]').attr('content')
    console.log(page)
    if (page === 'contacts-index') {
        setUp()
    }
});