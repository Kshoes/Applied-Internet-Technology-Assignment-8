// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more workouts
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  workouts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
});

// an exercise in a workout
// * includes the name of the exercise, the number of sets, reps, and weight
// * exercises in a workout can be crossed off once completed
const Exercise = new mongoose.Schema({
  name: {type: String, required: true},
  sets: {type: Number, min: 1, required: true},
  reps: {type: Number, min: 1, required: true},
  weight: {type: Number, min: 1, required: true},
  checked: {type: Boolean, default: false, required: true}
}, {
  _id: true
});

// a workout
// * each workout must have a related user
// * a workout can have 0 or more items
const Workout = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, required: true},
  exercises: [Exercise]
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below

mongoose.model('User', UserSchema);
const User = mongoose.model('User');
mongoose.model('Exercise', ExerciseSchema);
const Exercise = mongoose.model('Exercise');
mongoose.model('Workout', WorkoutSchema);
const Workout = mongoose.model('Workout');

mongoose.connect(dbconf, { useUnifiedTopology: true , useNewUrlParser: true});

module.exports = {
    User: User,
    Exercise: Exercise,
    Workout: Workout
};