// src/routes/home.js
const homeController = require("../controllers/homeController.js");
const Router = require("express");
const router = Router();

router.get("/", homeController.homePage);
router.get("/posts", homeController.allPosts);
router.get("/posts/published", homeController.published);
router.get("/posts/unpublished", homeController.unpublished);
router.get("/posts/view/:postId", homeController.viewPost);
router.get("/newpost", homeController.newPost);
router.get("/editpost/:postId", homeController.editPost);
router.get("/signup", homeController.newUser);

module.exports = router;
