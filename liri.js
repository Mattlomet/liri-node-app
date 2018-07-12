require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


inquirer.prompt([{
    type: "list",
    message: "Which action would you like to commit to?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "action"
}]).then(function (inquirerResponse) {

    fs.appendFile("log.txt", " First Prompt: " + inquirerResponse.action, function (err) {
        if (err) {
            console.log(err);
        }
    });

    if (inquirerResponse.action == "my-tweets") {

        client.get('statuses/user_timeline', function (error, tweets, response) {
            if (!error) {

                var str = JSON.stringify(tweets, null, 2);
                console.log(str);
            }
        });
    } else if (inquirerResponse.action == "spotify-this-song") {

        inquirer.prompt([{
            type: 'input',
            message: 'what song would you like to see?',
            name: 'songChoice'
        }]).then(function (response) {
            fs.appendFile("log.txt", " Song Choice: " + response.songChoice, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            spotify.search({
                type: 'track',
                query: response.songChoice
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var songInfo = data.tracks.items[0]

                console.log("Song Name - " + songInfo.name);
                console.log("---------------------------------")
                console.log("Artist Name(s) - " + (JSON.stringify(songInfo.artists[0].name, null, 2)));
                console.log("---------------------------------")
            });
        })
    } else if (inquirerResponse.action == "movie-this") {

        inquirer.prompt([{
            type: 'input',
            message: 'what movie would you like to see?',
            name: 'movieChoice'
        }]).then(function (response) {
            fs.appendFile("log.txt", " Movie Choice: " + response.movieChoice, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            if (response.movieChoice) {
                var queryUrl = "https://www.omdbapi.com/?t=" + response.movieChoice + "&y=&plot=short&apikey=trilogy"

            } else {
                var queryUrl = "https://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy"
            }

            request(queryUrl, function (error, response, body) {

                var bodyObj = JSON.parse(body);
                console.log("------------------");
                console.log(bodyObj.Title);
                console.log("------------------");
                console.log(bodyObj.Year);
                console.log("------------------");
                console.log(bodyObj.imdbRating);
                console.log("------------------");
                console.log(bodyObj.Ratings[1] ? bodyObj.Ratings[1].Value : 'N/A');
                console.log("------------------");
                console.log(bodyObj.Country);
                console.log("------------------");
                console.log(bodyObj.Language);
                console.log("------------------");
                console.log(bodyObj.Plot);
                console.log("------------------");
                console.log(bodyObj.Actors);
                console.log("-------------------");

            });

        });

    } else if (inquirerResponse.action == "do-what-it-says") {

        fs.readFile("random.txt", "utf8", function (error, data) {

            var dataArr = data.split(",");

            spotify.search({
                type: 'track',
                query: dataArr[1]
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var songInfo = data.tracks.items[0]

                console.log("Song Name - " + songInfo.name);
                console.log("---------------------------------")
                console.log("Artist Name(s) - " + (JSON.stringify(songInfo.artists[0].name, null, 2)));
                console.log("---------------------------------")

            });

        });
    }
});