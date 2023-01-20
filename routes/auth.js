const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');

/* GET sign up form view */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* POST sign up form get data to DB */
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('auth/signup', { error: 'All fields are necessary!' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/;
  if (!regex.test(password)) {
    res.render('auth/signup', {error: 'Password needs to contain at lesat 7 characters, one number, one lowercase an one uppercase letter.'})
    return;
  }
  try {
    const ifUserInDB = await User.findOne({ username: username });
    if (ifUserInDB) {
      res.render('auth/signup', { error: `There alredy is a user with username ${username}` });
      return
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = await User.create({ username, passwordHash });
      res.render('auth/profile', user);
    }
  } catch (error) {
    next(error)
  }
});

/* GET log in form view */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

/* POST log in form get data to DB */
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username | !password) {
    res.render('auth/login', { error: 'username or password do not match' });
    return;
  }
  try {
    const ifUserInDB = await User.findOne({ username: username });
    if (!ifUserInDB) {
      res.render('auth/login', { error: `${username} doesn't exist here!` })
      return
    } else {
      const passwordMatch = await bcrypt.compare(password, ifUserInDB.passwordHash);
      if (passwordMatch) {
        req.session.currentUser = ifUserInDB;
        res.render('auth/profile', ifUserInDB);
      } else {
        res.render('auth/login', { error: 'Unable to authenticate user :(' });
        return
      }
    }
  } catch (error) {
    next(error)
  }
});

/* GET /main view */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


module.exports = router;