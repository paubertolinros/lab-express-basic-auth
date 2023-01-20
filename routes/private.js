const router = require("express").Router();
const loggedIn = require('../middlewares');

/* GET private view */
router.get("/", loggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("private", { user });
});


module.exports = router;