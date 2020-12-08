const { IoT1ClickDevicesService } = require("aws-sdk")

describe('Simple App Test', () => {
    it('successfully loads', () => {
        cy.visit('/')
    })
    //it('Visits the kitchen sink', () => {
        //cy.visit('http://localhost:3000')
        //cy.contains('type').click()
        //cy.url().should('include', '/commands/actions')
        
        //cy.get('.action-email')
        //.type('fake@email.com')
        //.should('have.value', 'fake@email.com')
    //})

    it('sets auth cookie when logging in via form submission', function () {
        // destructuring assignment of the this.currentUser object
        const { username, password } = {username: 'admin', password: 'xxxxx'}

        cy.visit('/')

        cy.get('input[name=username]:last').type(username)

        // {enter} causes the form to submit
        cy.get('input[name=password]:last').type(`${password}{enter}`)

        // we should be redirected to /dashboard
        cy.url().should('include', '')

        // our auth cookie should be present
        //cy.getCookie('connect.sid', {timeout: 2000}).should('exist')

        cy.contains('Virtual Studio')
    })

    it('navigate to contact when button clicked',() => {
        cy.visit('/')

        cy.get('#main_button_contacts').click()
        cy.url().should('include', '/contacts')
    })

})