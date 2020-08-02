const Comment = require("../models/Comment");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const fs = require("fs-extra");

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

module.exports = {
  getPosts: async (req, res) => {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploader",
        },
      },
      {
        $match: {
          private: false
        }
      }
    ]);
    console.log(posts);
    res.render("home", {
      posts: posts.map((x) => ({
        ...x,
        uploader: x.uploader[0],
        createdDate: `${x.createdDate.getUTCDate()} de ${
          months[x.createdDate.getUTCMonth()]
        } del ${x.createdDate.getFullYear()}`,
      })),
    });
  },

  getPostsByUser: async (req, res) => {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploader",
        },
      },
      {
        $match:
          req.user != undefined && req.user._id == req.params.userId
            ? {
                userId: mongoose.Types.ObjectId(req.params.userId),
              }
            : {
                private: false,
                userId: mongoose.Types.ObjectId(req.params.userId),
              },
      },
    ]);
    console.log(posts);
    res.render("auth/profile", {
      posts: posts.map((x) => ({
        ...x,
        uploader: x.uploader[0],
        createdDate: `${x.createdDate.getUTCDate()} de ${
          months[x.createdDate.getUTCMonth()]
        } del ${x.createdDate.getFullYear()}`,
      })),
    });
  },

  makePrivate: (req, res) => {
    if (req.query.id) {
      Post.updateOne({ _id: req.query.id }, {
        $set: {
          private: req.query.rev ? false : true
        }
      }).then(() => {
        res.status(200).json({
          msg: 'Hecha privada con exito'
        })
      })
    }
  },

  uploadPost: (req, res) => {
    console.log(req.file);
    if (req.user) {
      const post = new Post();
      post.fullPath = req.file.path;
      post.userId = req.user._id;
      post.title = req.body.title;
      post.description = req.body.description;
      post.imageUrl = `/images/uploads/${req.user.username}/${req.file.filename}`;
      post
        .save()
        .then((image) => {
          return res.status(200).redirect("/");
        })
        .catch((err) => {
          fs.unlink(req.file.path);
          res.json({ error: err.message });
        });
    } else {
      return res.status(401).json({
        msg: "Must be logged in to upload images.",
      });
    }
  },

  deletePost: (req, res) => {
    if (req.query.id) {
      Post.findOneAndDelete({ _id: req.query.id }).then((post) => {
        fs.unlink(post.fullPath);
        res.json({
          message: "Post delted successfully",
        });
      });
    }
  },

  addComment: (req, res) => {
    if (req.user !== null) {
      const comment = new Comment({ ...req.body.comment });
      comment.commenter = req.user._id;
    }
  },

  addLike: (req, res) => {
    if (req.user !== null) {
      Image.findOne({ _id: req.params.id }).then((image) => {
        if (image.likes.find(req.user) !== -1) {
          image
            .updateOne({
              $set: {
                likes: [...likes, req.user],
              },
            })
            .then((img) => {
              res.status(200).json({
                ok: true,
                msg: "Like added",
              });
            });
        } else {
          res.status(203).json({
            ok: false,
            msg: "You already liked this post",
          });
        }
      });
    } else {
      res.status(403).json({
        ok: false,
        msg: "You're not logged in",
      });
    }
  },
};
