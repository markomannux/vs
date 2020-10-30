function isLoggedIn(request, response, next) {
    // passport adds this to the request object
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login');
}

module.exports = {
    isLoggedIn
}