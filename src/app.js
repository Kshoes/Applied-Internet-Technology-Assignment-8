
require('./db.js');

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
// const authRoutes = require('./routes/auth-routes');
const path = require('path');
const bodyParser = require('body-parser');

const flash = require('express-flash');
app.use(flash());

// enable sessions
const session = require('express-session');
const sessionOptions = {
  secret: process.env.SESSION_SECRET, //'secret cookie thang (store this elsewhere!)',
  resave: true,
  saveUninitialized: true
};
app.use(session(sessionOptions));

const methodOverride = require('method-override');  // override post to call app.delete
app.use(methodOverride('_method'));

const passport = require('passport');
require('./config/passport-config.js');

// const initializePassport = require('./config/passport-config.js');

// initializePassport(
//   passport, 
//   function (username) { User.findOne({ username: username }).bind(username), function(err, user) {return user.username}},
//   // username => users.find(user => user.username = username), 
//   function(id) { return User.findOne({ _id: id }).bind(id), function(err, user) {return user._id}},
//   // id => users.find(user => user.id = id)
// );




app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

const bcrypt = require('bcrypt');



const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const User = mongoose.model('User');
const Workout = mongoose.model('Workout');
const Exercise = mongoose.model('Exercise');

// route setup
// app.use('/auth', authRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', checkAuthenticated, (req, res) => {

  res.render('index', { name: req.user.username})
  // const userQ = req.query.userQ;
  // const nameQ = req.query.nameQ;
  // const createdAtQ = req.query.createdAtQ;
  // const exercisesQ = req.query.exercisesQ;

  // const queryObj = {};
  // if (userQ) {
  //   queryObj.user = userQ;
  //   console.log(queryObj);
  // }
  // if (nameQ) {
  //   queryObj.name = nameQ;
  //   console.log(queryObj);
  // }
  // if (createdAtQ) {
  //   queryObj.createdAt = createdAtQ;
  //   console.log(queryObj);
  // }
  // if (exercisesQ) {
  //   queryObj.exercises = exercisesQ;
  //   console.log(queryObj);
  // }
  // Workout.find(queryObj, (err, workouts) => {
  //   if (err) {
  //     throw err;
  //   }
  //   else {
  //     Workout.find().populate('user_id').populate('exercises').exec( (err, workouts) => {
  //       if(err) {
  //         throw err;
  //       }
  //       else {
  //         console.log('WORKOUT: ' + workouts);
  //         res.render('index', {workouts: workouts});
  //       }
  //     });
  //   }
  // });
});



app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
});

app.post('/register', checkNotAuthenticated, (req, res) => {
  User.register(new User({username:req.body.username}), 
  req.body.password, function(err, user){
  if (err) {
    res.render('register', { message:'Invalid registration, try again' });
  } else {
  passport.authenticate('local')(req, res, function() {
    res.redirect('/');
  });
}
});
});

// app.post('/register', checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUser = new User({
//       username: req.body.username,
//       password: hashedPassword
//     });
//     newUser.save((err, result) => {
//       if(err) {
//         throw err;
//       }
//       else {
//         res.json(result);
//       }
//       res.redirect('/login');
//     });
//   }
//   catch {
//     res.redirect('/register');
//   }
// });







app.get('/workouts', checkAuthenticated, (req, res) => {

  Workout.find({}, (err, workouts) => {
    if (err) {
      throw err;
    }
    else {
      Workout.find().populate('user_id').populate('exercises').exec( (err, workouts) => {
        if(err) {
          throw err;
        }
        else {
          console.log('WORKOUT: ' + workouts);
          res.render('index', {workouts: workouts});
        }
      });
    }
  });

});

app.get('/workouts/create', checkAuthenticated, (req, res) => {
  res.render('create');
});

app.post('/workouts/create', checkAuthenticated, (req, res) => {
  const newWorkout = new Workout({
    user: {
      username: req.body.user,
      password: "password"
    },
    name: req.body.name,
    createdAt: Date.now(),
    exercises: []
  });

  const exerciseCount = req.body.exerciseContainer.childNodes.length/8; //lastChild.name.slice(2, 3); 
  console.log(exerciseCount);
  for(let i = 1; i <= exerciseCount; i++) {

    const newExercise = new Exercise({
      name: req.body.exerciseContainer.childNodes[(i*2)],
      sets: req.body.exerciseContainer.childNodes[((i+1)*2)],
      reps: req.body.exerciseContainer.childNodes[((i+2)*2)],
      weight: req.body.exerciseContainer.childNodes[((i+3)*2)],
    });
    newWorkout.exercises.push(newExercise);
    
  }

  newWorkout.save((err) => {
    if(err) {
        throw err;
    }
    if(req.session.added) {
        req.session.added.push(newWorkout);
    }
    else {
        req.session.added = [];
        req.session.added.push(newWorkout);
    }
    res.redirect('/');
  });
});

// app.post('/login', passport.authenticate('local', { // stub code for passport
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}


app.listen(PORT);
console.log('Server started; type CTRL+C to shut down');

 /*

{
  "user_id": "5ddaf763a2518ff152280549",
  "name": "Leg Day",
  "exercises": [
      {
          "name": "squats",
          "sets": 5,
          "reps": 6,
          "weight": 225,
          "checked": "true"
      },
      {
          "name": "deadlifts",
          "sets": 5,
          "reps": 6,
          "weight": 225,
          "checked": "false"
      },
      {
          "name": "hip thrusts",
          "sets": 5,
          "reps": 8,
          "weight": 135,
          "checked": "false"
      }
  ],
  "createdAt": "11/11/19"
}

*/