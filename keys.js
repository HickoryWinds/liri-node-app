console.log("\nthis is loaded");

// console.log(process.env);

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

// console.log("keys ");
// console.log(exports.spotify);