const express = require('express');
const queryString = require('query-string');

const app = express();

const USERS = [{
    id: 1,
    firstName: 'Joe',
    lastName: 'Schmoe',
    userName: 'joeschmoe@business.com',
    position: 'Sr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  }, {
    id: 2,
    firstName: 'Sally',
    lastName: 'Student',
    userName: 'sallystudent@business.com',
    position: 'Jr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  // ...other users
];

function gateKeeper(req, res, next) {
  // your code should replace the line below
  
  if (req.get('x-username-and-password')) {
    let loginAttempt = req.get('x-username-and-password');
    loginAttempt = queryString.parse(loginAttempt);
    let correctUser = USERS.find(item => {
      return item.password == loginAttempt.pass && item.userName == loginAttempt.user;
    })

    if (correctUser) {
      req.user = correctUser;
    } else {
      let date = new Date();
      console.log(`Failed login attempt at ${date} using ${JSON.stringify(loginAttempt)}`);
    }
  }

  next();
}

app.use(gateKeeper);

app.get("/api/users/me", (req, res) => {
  if (req.user === undefined) {
    return res.status(401).json({
      message: 'Must supply valid user credentials'
    });
  }
  const {
    firstName,
    lastName,
    id,
    userName,
    position
  } = req.user;
  return res.json({
    firstName,
    lastName,
    id,
    userName,
    position
  });
});

// ... start the app
app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});