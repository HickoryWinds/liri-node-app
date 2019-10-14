require("dotenv").config();

var moment = require("moment");

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

// console.log("liri");
// console.log(keys.spotify);

var spotify = new Spotify(keys.spotify);

// commands: concert-this, spotify-this-song, movie-this, do-what-it-says

// Include the axios npm package
var axios = require("axios");
// include file handling to read random.txt
var fs = require("fs");
// Get the name of the search option and the name to search for
var nodeArg = process.argv;
// Search option
var searchType = nodeArg[2];
// Title of search for
var name = [];
// var searchName = "";
for (var i = 3; i < nodeArg.length; i++) {
    name.push(nodeArg[i]);
    // console.log(name);
}

if (searchType == "movie-this") {
    movieThis(name)
}
function movieThis(name) {
    // start movie query
    var searchName = name.join(" ");
    if (searchName === "") {
        searchName = "Mr. Nobody";
    } 
    console.log("search " + searchName);
    // Then run an axios request to movieThis API
    var queryUrl_OMDB = "http://www.omdbapi.com/?t=" + searchName + "&y=short&apikey=trilogy";
    // Debug code
    // console.log(queryUrl_OMDB);
    axios.get(queryUrl_OMDB).then(
        function(response) {
            console.log("\nMovie Title: " + response.data.Title);
            console.log("Year Released: "  + response.data.Year);
            console.log("IMBD Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Made in: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
            // console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
            if (error.response) {
                // }
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    };
    //end movie query

if (searchType == "concert-this") {
 concertThis(name);
}
function concertThis(name) {
    // start bands in town query
    var searchName = name.join("+");
    // Then run an axios request to Bands in Town API
    // var queryUrl_BIT = "https://rest.bandsintown.com/artists/celine+dion/events?app_id=codingbootcamp";
    var queryUrl_BIT = "https://rest.bandsintown.com/artists/" + searchName + "/events?app_id=codingbootcamp";
    // Debug code
    // console.log(queryUrl);
    axios.get(queryUrl_BIT).then(
        function(response) {
            var BIT = Object.keys(response.data).length;
            // console.log(typeof(BIT));
            // console.log(BIT);
            // console.log("----------------");
            if (BIT === 0 || (response.data[0].venue == undefined)) {
                console.log("\nNo concert listings found.")
            } else {
                for (var i = 0; i < BIT; i++) {
                    console.log("\nConcert Listing " + (i + 1));
                    // console.log(JSON.stringify(response.data[i]));
                    // console.log(response.data[i]);
                    console.log(response.data[i].venue.name);
                    console.log(response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                    var dateTime = response.data[i].datetime;
                    console.log(moment(dateTime).format("MM/DD/YYYY"));
                }
            }
        })
        .catch(function(error) {
            if (error.response) {
                // }
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
        // end bands in town query
    }


if (searchType == "spotify-this-song") {
    spotThis(name);
}
function spotThis(name) {
    // console.log("s " + name);
// start spotify query
var searchName = name.join(" ");
// spotify.search({ type: 'track', query: 'All the Small Things', limit: '5' }, function(err, data) {
spotify.search({ type: 'track', query: searchName, limit: '5' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var Spot = Object.keys(data.tracks.items).length;
    // console.log(Spot);

    for (var j = 0; j < Spot; j++) {
         
        // console.log(JSON.stringify(data.items[j])); 
        // if ((searchName ===  data.tracks.items[j].name) || (searchName  + " - Remastered" ===  (data.tracks.items[j].name))) {
            // console.log(JSON.stringify(data.tracks.items[j])); 
            console.log("\nTrack Name: " + data.tracks.items[j].name); 
            console.log("Album: " + data.tracks.items[j].album.name); 
            console.log("Artist: " + data.tracks.items[j].album.artists[0].name); 
            console.log("Preview URL: " + data.tracks.items[j].preview_url); 
            console.log("--------------");
        // }
    }
});
// end spotify query
}
   
if (searchType == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
          }
          // We will then print the contents of data
        //   console.log(data);
          // Then split it by commas (to make it more readable)
          var dataArr = data.split(",");
          // We will then re-display the content as an array for later use.
          var operation = dataArr[0];
          var lookFor = dataArr[1].split(" ");
        //   console.log(operation + " " + lookFor);
        //   var doThis = "node " + "liri.js " + operation + " " + lookFor;
        //   console.log(doThis);
          if (operation == "spotify-this-song") {
              spotThis(lookFor);
          }
          if (operation == "concert-this") {
              concertThis(lookFor);
          }
          if (operation == "movie-this") {
              movieThis(lookFor);
          }
    });
}