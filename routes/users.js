var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");
var postsController = require("../controllers/postController");

const passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login");
  })
  .post(
    passport.authenticate("local", {
      session: true,
      failureRedirect: "/login",
      failureFlash: {
        type: "messageFailure",
        message: "Invalid email and/ or password.",
      },
    }),
    userController.loginUser
  );

router
  .route("/register")
  .get((req, res) => {
    res.render("auth/register");
  })
  .post(userController.registerUser);

router.post('/searchUser', userController.searchProfile);

router
  .route("/profile/:userId/:section")
  .get((req, res) => {
    if (req.params.section === "posts") {
      return postsController.getPostsByUser(req, res);
    }
    res.render("auth/profile");
  })
  .post((req, res) => {
    if (req.params.section === "security") {
      userController.updatePassword(req, res);
    } else if (req.params.section === "personal") {
      userController.updateInfo(req, res);
    }
  });

router.get("/logout", userController.logoutUser);
module.exports = router;
