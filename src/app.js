
require('./db.js');

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-routes');
const path = require('path');
const bodyParser = require('body-parser');

const passport = require('passport');
const bcrypt = require('bcrypt');

// enable sessions
const session = require('express-session');
const sessionOptions = {
  secret: 'secret cookie thang (store this elsewhere!)',
  resave: true,
  saveUninitialized: true
};
app.use(session(sessionOptions));

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const User = mongoose.model('User');
const Workout = mongoose.model('Workout');
const Exercise = mongoose.model('Exercise');

// route setup
app.use('/auth', authRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const userQ = req.query.userQ;
  const nameQ = req.query.nameQ;
  const createdAtQ = req.query.createdAtQ;
  const exercisesQ = req.query.exercisesQ;

  const queryObj = {};
  if (userQ) {
    queryObj.user = userQ;
    console.log(queryObj);
  }
  if (nameQ) {
    queryObj.name = nameQ;
    console.log(queryObj);
  }
  if (createdAtQ) {
    queryObj.createdAt = createdAtQ;
    console.log(queryObj);
  }
  if (exercisesQ) {
    queryObj.exercises = exercisesQ;
    console.log(queryObj);
  }
  Workout.find(queryObj, (err, workouts) => {
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


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    });
    newUser.save((err, result) => {
      if(err) {
        throw err;
      }
      else {
        res.json(result);
      }
      res.redirect('/login');
    });
  }
  catch {
    res.redirect('/register');
  }
})


app.get('/workouts', (req, res) => {

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

app.get('/workouts/create', (req, res) => {
  res.render('create');
});

app.post('/workouts/create', (req, res) => {
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

app.post('/login', passport.authenticate('local', { // stub code for passport
  successRedirect: '/',
  failureRedirect: '/login'
}));

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