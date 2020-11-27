function isLoggedIn(request, response, next) {
    // passport adds this to the request object
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login');
}

function hasRole(role) {
    return function(request, response, next) {
        const authorized = request.user.roles.indexOf(role) !== -1
        if (authorized) {
            return next()
        }
        
        response.render('unauthorized')

    }
}

module.exports = {
    isLoggedIn,
    hasRole
}