const OAuth2Strategy  = require('passport-oauth2');
const cognitoClient = require('../../cognito-client')
const jwt           = require('jsonwebtoken')
const User = require('../../../model/user')

function init(app, passport) {
    console.log('Cognito passport strategy initialization')
    OAuth2Strategy.prototype.userProfile = cognitoClient.userProfile

    const AUTH_URL = process.env.AUTH_URL; 
    const TOKEN_URL = process.env.TOKEN_URL;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const CALLBACK_URL = process.env.CALLBACK_URL;

    passport.use(new OAuth2Strategy({
        authorizationURL: AUTH_URL,
        tokenURL: TOKEN_URL,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, cb) {
        const parsedProfile = JSON.parse(profile)
        const parsedToken = jwt.decode(accessToken)

        await User.findOneAndUpdate(
        {
            username: parsedProfile.username
        },
        {
            username: parsedProfile.username,
            email: parsedProfile.email,
            roles: parsedToken['cognito:groups']
        },
        {
            upsert: true
        }
        )
        return cb(null, parsedProfile);
    }
    ));

    app.get('/login', passport.authenticate('oauth2',
        {
            scope: ['openid'],
            successRedirect: '/',
            failureRedirect: '/'
        }))

    app.get('/auth/loginCallback', passport.authenticate('oauth2', { failureRedirect: '/'}), (req, res) => {
        return res.redirect('/')
    })

    app.get('/auth/logoutCallback', (req, res) => {
        req.logout()
        res.redirect('/')
    })
}

module.exports = init
