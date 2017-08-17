var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware");
var geocoder = require('geocoder');

router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var price = req.body.price;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/locations");
        }
    });
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var campground = req.body.campground;
    geocoder.geocode(campground.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        campground.location = location;
        campground.lat = lat;
        campground.lng = lng;
        Campground.findByIdAndUpdate(req.params.id, campground, function(err, updatedCampground) {
            if (err) {
                res.redirect("back");
            } else {
                res.redirect("/locations/" + req.params.id);
            }
        });
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/locations");
        }
    });
});

module.exports = router;