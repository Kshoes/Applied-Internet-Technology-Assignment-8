const passport = require('passport');
const GoogleLogin = require('passport-google-oath20');
const keys = require('./keys');

passport.use(
    new GoogleLogin({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }), () => {

    }
);