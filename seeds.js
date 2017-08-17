var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "King's Landing",
        price: "120.00",
        image: "https://vignette3.wikia.nocookie.net/gameofthrones/images/4/43/GreatSeptExteriors.jpg/revision/latest?cb=20150321161915",
        description: "Home of the Iron Throne"
    },
    {
        name: "Winterfell",
        price: "50.00",
        image: "https://vignette2.wikia.nocookie.net/gameofthrones/images/5/50/Winterfell_Exterior.jpg/revision/latest?cb=20110705175851",
        description: "Home of House Stark"
    },
    {
        name: "Casterly Rock",
        price: "90.00",
        image: "http://vignette2.wikia.nocookie.net/gotascent/images/c/ce/Lannister_Background.jpg/revision/latest?cb=20130531202140",
        description: "A great rock"
    }
]

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("ALL CAMPGROUNDS REMOVED!");
            data.forEach(function(seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a campground.");
                    }
                });
            });
        }
    });
}

module.exports = seedDB;