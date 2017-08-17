var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

router.post("/register", function(req, res) {
    var newUser = {
        username: req.body.username,
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to Westeros " + user.username);
                res.redirect("/locations");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local",
    {
    successRedirect: "/locations",
    failureRedirect: "/login"
    }),function(req, res) {
});

router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success", "Logged out sucessfully.");
    res.redirect("/locations");
});

module.exports = router;