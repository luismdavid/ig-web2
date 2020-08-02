const multer = require("multer");
const fs = require("fs-extra");
const uuid = require("uuid/v4");
const path = require("path");
const postsController = require("../controllers/postController");
const { Router } = require("express");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.user) {
      const ruta = path.join(
        __dirname,
        "../public/images/uploads"
      );
      return cb(null, ruta);
    }
    return cb(null, "");
  },
  filename: (req, file, cb, filename) => {
    console.log(file);
    cb(null, uuid() + path.extname(file.originalname));
  },
});

router
  .route("/post")
  .get(postsController.getPosts)
  .delete(postsController.deletePost);
router
  .route("/post/upload")
  .get((req, res) => {
    res.render("posts/upload");
  })
  .post(multer({ storage }).single("image"), postsController.uploadPost);

  router.route('/makePrivate').put(postsController.makePrivate);

module.exports = router;
