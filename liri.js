// use dotenv to keep passphrases hidden from public view
require("dotenv").config();

// use keys.js to keep passphrases hidden
var keys = require("./keys.js");

// create variables so npm modules can be used
// use moment for formatting time display
var moment = require("moment");
// use Spotify to retrieve song information 
var Spotify = require("node-spotify-api");
// Include axios npm package to retrive concert and movie information
var axios = require("axios");
// include file handling to read random.txt
var fs = require("fs");

// variables to store input for search option and the name to search for
// note that argv[0] is the node command and argv[1] is the js file to run
// Search option
var searchType = nodeArg[2];
// variable store input to be processed
var nodeArg = process.argv;
// array to store string to search for
var name = [];
// process arg[3] and greater to split off search string
for (var i = 3; i < nodeArg.length; i++) {
    name.push(nodeArg[i]);
}

// create new Spotify object as variable to use in calling api
var spotify = new Spotify(keys.spotify);

// choose which option to run
if (searchType == "movie-this") {
    movieThis(name)
}

if (searchType == "concert-this") {
    concertThis(name);
}

if (searchType == "spotify-this-song") {
    spotThis(name);
}

if (searchType == "do-what-it-says") {
    // set up read from text file
    fs.readFile("random.txt", "utf8", function(error, data) {
        // if error is thrown, display error to user on console
        if (error) {
            return console.log(error);
          }
          // split data into module to run, dataArr[0],
          // and inquiry string, dataArr[1], based on comma separator
          var dataArr = data.split(",");
          var operation = dataArr[0];
          // split inquiry string so it can be reassembled in the proper
          // form in each module
          var lookFor = dataArr[1].split(" ");
          // choose option to run based on what is written in text file
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


function movieThis(name) {
    // start movie query by joining components of search string
    var searchName = name.join(" ");
    // if no search name input, search for 'Mr. Nobody'
    if (searchName === "") {
        searchName = "Mr. Nobody";
    } 
    // run an axios request to API
    var queryUrl_OMDB = "http://www.omdbapi.com/?t=" + searchName + "&y=short&apikey=trilogy";
    axios.get(queryUrl_OMDB).then(
        function(response) {
            // display information about movie
            console.log("\nMovie Title: " + response.data.Title);
            console.log("Year Released: "  + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Made in: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        })
        // if error occurs, catch the response
        .catch(function(error) {
            if (error.response) {
                // if server response falls out of the range of 2xx, display error code
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // `error.request` is an object that comes back when request was made but
                // no response received
                console.log(error.request);
            } else {
                // error occurred when setting up request
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    };
    //end movie query

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


function spotThis(name) {
// start spotify query
var searchName = name.join(" ");
spotify.search({ type: 'track', query: searchName, limit: '5' }, function(err, data) {
    // set up error logging
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // count number of keys in object and deteremine its length
    var Spot = Object.keys(data.tracks.items).length;
    // lists all concerts based on total number of keys
    for (var j = 0; j < Spot; j++) {
        // list information about track - note search if performed using key words
        // so that track and artists with key words are returned
        // variability in track naming does not allow a restricted search
        // eg. remastered may be added to track name
        console.log("\nTrack Name: " + data.tracks.items[j].name); 
        console.log("Album: " + data.tracks.items[j].album.name); 
        console.log("Artist: " + data.tracks.items[j].album.artists[0].name); 
        console.log("Preview URL: " + data.tracks.items[j].preview_url); 
        console.log("--------------");
    }
});
// end spotify query
}
   