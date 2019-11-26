

# Fitness Witness

## Overview


Keeping up with a regular habit of exercise is hard enough. Trying to remember new workouts and keeping track of old ones also wastes time and effort, when you could be using those precious minutes to maximize dem GAINZ. 💪

Fitness Witness is a web app that will allow users to keep track of their workout routines. Users can register and login. Once they're logged in, they can create and view their workout routines. As the users work out, they can select a routine and check off exercises as they go.

(Optional features:)
- Users can also add other users as friends and view their public workouts
- Users can also track their progress regarding body weight and strength (workout template, add variable weight/sets/reps during the workout)

## Data Model


The application will store Users, Workouts, and Exercises (maybe make Sets schema to customize reps/weight for each set)

* users can have multiple workouts (via references)
* each workout can have multiple exercises (via references)


An Example User:

```javascript
{
  username: "reps4jesus",
  hash: // a password hash,
  // ...etc, implemented by passport.js
}
```

An Example Workout with Exercises:

```javascript
{
  user: "Kshoes", // a reference to a User object
  name: "Leg Day",
  exercises: [
    { name: "squats", sets: 5, reps: 6, weight: 225, checked: true},  // weight in lbs
    { name: "deadlifts", sets: 5, reps: 6, weight: 225, checked: false},
    { name: "hip thrusts", sets: 5, reps: 8, weight: 135, checked: false}
  ],
  createdAt: // timestamp
}
```

## [Link to Commented First Draft Schema](src/db.js) 


## Wireframes


/ - home page

![/](documentation/index.jpg)

/register - registration page

![/register](documentation/registration.jpg)

/login - login page

![/login](documentation/login.jpg)

/workouts/create - page for creating a new workout

![workouts create](documentation/workouts-create.jpg)

/workouts - page for showing all workouts

![workouts](documentation/workouts.jpg)

/list/slug - page for showing specific workout

![workouts](documentation/workouts-slug.jpg)

## Site map

![Site Map](documentation/sitemap.jpg)

## User Stories or Use Cases


1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new workout
4. as a user, I can view all of the workouts I've created in a single list
5. as a user, I can add items to an existing workout
6. as a user, I can cross off exercises in an existing workout once I've completed them

## Research Topics


* (5 points) Integrate user authentication
    * I'm going to be using passport or parsley for user authentication
    * An account will be made for testing; I'll email/dm you the password
    * users not logged in/unregistered users will automatically be redirected to the login page
* (3 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom

## [Link to Initial Main Project File](src/app.js) 


## Annotations / References Used


1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)

