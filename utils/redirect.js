const redirect = (res, to) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: to});
}

module.exports = redirect