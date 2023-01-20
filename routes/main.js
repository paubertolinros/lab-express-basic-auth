const router = require("express").Router();

/* GET main view */
router.get("/", (req, res, next) => {
  const user = req.session.currentUser;
  console.log(user)
  res.render("main", { user });
});

module.exports = router;