// src/controllers/homeController.js

const homePage = (req, res) => {
    return res.render("index");
    // return res.send("We are the world!");
};

const allPosts = (req, res) => {
    return res.render("posts");
};

const published = (req, res) => {
    return res.render("published");
};

const unpublished = (req, res) => {
    return res.render("unpublished");
};

const viewPost = (req, res) => {
    return res.render("viewpost");
};

const newPost = (req, res) => {
    return res.render("newpost");
};

const editPost = (req, res) => {
    return res.render("editpost");
};

const newUser = (req, res) => {
    return res.render("signup");
};

module.exports = {
    homePage,
    allPosts,
    published,
    unpublished,
    viewPost,
    newPost,
    editPost,
    newUser,
};
