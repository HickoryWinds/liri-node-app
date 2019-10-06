requestAnimationFrame("dotenv").config();

var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);

// commands: concert-this, spotify-this-song, movie-this, do-what-it-says