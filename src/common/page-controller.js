export default class PageController {

    constructor(pageName) {
        this.pageName = pageName;
        document.addEventListener('turbolinks:load', () => {
            const page = $('[name=page]').attr('content')
            if (page === this.pageName) {
                this.setUp()
            }
        })

        document.addEventListener('turbolinks:before-render', () => {
            this.tearDown();
        })
    }

    setUp() {
        console.log(`Setting up ${this.pageName}`)
    }

    tearDown() {
        console.log(`Tearing down ${this.pageName}`)
    }
}