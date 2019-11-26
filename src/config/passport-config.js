
const mongoose = require('mongoose');
const User = mongoose.model('User');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');



function initialize(passport, getUserByUsername, getUserById) {

    const authenticateUser = (username, password, done) => {
        const user = getUserByUsername(username);
        // User.findOne( {username: username}, async function(err, user) {

            // if(!user) {
            //     return done(null, false, {message: 'User not found'});
            // }
    
            // try {
            //     if ( await bcrypt.compare(password, user.password) ) {
            //         return done(null, user)
            //     }
            //     else {
            //         return done(null, false, {message: 'Password incorrect'})
            //     }
            // }
            // catch(err) {
            //     return done(err);
            // }


        // });

            if (err) { return done(err); }

            if (!user) {
              return done(null, false, { message: 'User not found' });
            }

            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);



        // if(user == null) {
        //     return done(null, false, {message: 'User not found'});
        // }

        // try {
        //     if ( await bcrypt.compare(password, user.password) ) {
        //         return done(null, user)
        //     }
        //     else {
        //         return done(null, false, {message: 'Password incorrect'})
        //     }
        // }
        // catch(err) {
        //     return done(err);
        // }

    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    // passport.serializeUser(User.serializeUser());
    // passport.deserializeUser(User.deserializeUser());

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;