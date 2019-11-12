  
require('./db.js');

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

const passport = require('passport');

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
  if(userQ) {
      queryObj.user = userQ;
      console.log(queryObj);
  }
  if(nameQ) {
      queryObj.name = nameQ;
      console.log(queryObj);
  }
  if(createdAtQ) {
      queryObj.createdAt = createdAtQ;
      console.log(queryObj);
  }
  if(exercisesQ) {
    queryObj.exercises = exercisesQ;
    console.log(queryObj);
  }
  Workout.find(queryObj, (err, workouts) => {
      if(err) {
          throw err;
      }
      else {
          res.render('index', {workouts: workouts});
      }
  });
});

app.get('/workouts', (req, res) => {
  res.render('index');
})

app.get('/workouts/create', (req, res) => {
  res.render('create');
})

app.post('/login', passport.authenticate('local', { // stub code for passport
  successRedirect: '/',
  failureRedirect: '/login' 
}));

app.listen(PORT);
console.log('Server started; type CTRL+C to shut down');