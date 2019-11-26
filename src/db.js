
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more workouts
const UserSchema = new mongoose.Schema({
  // username: {type: String, required: true}, // username provided by authentication plugin
  // password: {type: String, required: true}  // password hash provided by authentication plugin
  // workouts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
});

const passportLocalMongoose = require('passport-local-mongoose');
UserSchema.plugin(passportLocalMongoose);

// an exercise in a workout
// * includes the name of the exercise, the number of sets, reps, and weight
// * exercises in a workout can be crossed off once completed
const ExerciseSchema = new mongoose.Schema({
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
const WorkoutSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, required: true},
  exercises: [{type: mongoose.Schema.Types.ObjectId, ref:'Exercise'}]
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below

mongoose.model('User', UserSchema);
const User = mongoose.model('User');
mongoose.model('Exercise', ExerciseSchema);
const Exercise = mongoose.model('Exercise');
mongoose.model('Workout', WorkoutSchema);
const Workout = mongoose.model('Workout');


// Workout.find({ "user_id": "5864ac80fa769f09a4881791" })
//     .populate('user_id')
//     .exec(function (err, docs) {
//         //console.log(docs[0].user_id.name);
//         console.log(docs);
//     });

let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '../config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // connection string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = process.env.MONGODB_URI // || 'mongodb://localhost/fitnesswitnessdb' //'mongodb://testUser:testPassword1@ds241258.mlab.com:41258/heroku_wrt6b2wv';
}

mongoose.connect(dbconf, {useUnifiedTopology: true , useNewUrlParser: true});


module.exports = {
    User: User,
    Exercise: Exercise,
    Workout: Workout
};