// display message on console when loaded into liri.js
console.log("\nthis is loaded");

// export data so it is available to liri.js module
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};
