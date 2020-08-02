const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { use } = require("passport");

module.exports = {
  registerUser: async (req, res) => {
    const user = new User(req.body);
    console.log("registering user", req.body);
    if (!user.email || !user.password || !user.username || !user.name) {
      res.render("auth/register", {
        error:
          "No ha ingresado los datos correctamente, por favor intente de nuevo.",
      });
      return;
    }
    const exists = await User.findOne({ email: user.email });
    if (exists) {
      res.render("auth/register", {
        error: "Ya existe un usuario con el correo ingresado.",
      });
      return;
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        console.log(hash);
        user.password = hash;
        user
          .save()
          .then((user) => {
            res.status(201).render("index", user);
          })
          .catch((err) =>
            res.status(500).render("error", {
              message: err.message,
              error: {
                status: 500,
                stack: "nose",
              },
            })
          );
      });
    });
  },

  loginUser: (req, res) => {
    res.redirect("/");
  },

  logoutUser: (req, res) => {
    req.logout();
    res.redirect("/");
  },

  updatePassword: (req, res) => {
    const passwords = req.body;

    if (passwords.password !== passwords.passwordRepeat) {
      res.redirect("/profile/security");
      return;
    }
    const user = new User(req.user);
    bcrypt.genSalt(10, (err, salt) => {
      console.log(passwords.password);
      bcrypt.hash(passwords.password, salt, (err, hash) => {
        user.password = hash;
        user
          .save()
          .then(() => {
            res.status(201).redirect("/profile/personal");
          })
          .catch((err) =>
            res.status(500).render("error", {
              message: err.message,
              error: {
                status: 500,
                stack: "nose",
              },
            })
          );
      });
    });
  },

  updateInfo: (req, res) => {
    const { name, username, email, lastname } = req.body;
    if (!name || !username || !email) {
      return res.status(404).redirect("/profile/personal");
    }
    const user = new User(req.user);
    user.name = name;
    user.username = username;
    user.lastname = lastname;
    user.email = email;
    console.log(username);
    user
      .save()
      .then(() => {
        res.status(200).redirect("/profile/personal");
      })
      .catch((err) =>
        res.status(500).render("error", {
          message: err.message,
          error: {
            status: 500,
            stack: "nose",
          },
        })
      );
  },

  searchProfile: (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      res.redirect(`/profile/${user._id}/posts`)
    }).catch(error => {
      res.status(404).redirect('/');
    })
  }
};
