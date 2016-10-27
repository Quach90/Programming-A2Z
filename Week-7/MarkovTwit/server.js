var express = require('express');

var app = express();

var server = app.listen(3000, listen);

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

// This is for hosting files
// Anything in the public directory will be served
// This is just like python -m SimpleHTTPServer
// We could also add routes, but aren't doing so here
app.use(express.static('public'));

var Twit = require('twit');

var config = require('./config.js');

var T = new Twit(config);



// Pulling the Markov object from a separate "module" - markov.js
var markov = require('./markovWord');

var markovChar = require('./markov');

// An object that acts as dictionary of words and counts
var generator = null;

var lastSavedIdUser = null;

// Route for a new generated phrase
app.get('/generate', generate);

// Callback
function generate(req, res) {
    // Send as JSON
    console.log(req.query.user);
    console.log(req.query.reset)
    var tweetsToTrain = req.query.train;

    if (req.query.reset == 'true') {
        console.log("Markov Reset");
        createMarkov(req.query.word, req.query.n, req.query.max)
    } else if (generator == null) {
        console.log("Markov first time");
        createMarkov(req.query.word, req.query.n, req.query.max)
    } else {
        console.log("Markov not reset");
    }

    function createMarkov(word, n, max) {
        if (word == 'false') {
            console.log('Created Markov by Char')
            generator = new markovChar.Generator(Number(n), Number(max));
        } else {
            console.log('Created Markov by Word')
            generator = new markov.Generator(Number(n), Number(max));
        }
    }
    var tweetCounter = 0;

    if(req.query.reset == 'false'){
      console.log("Keep training");
      getTweet(req.query.user, lastSavedIdUser)
    } else {
      getTweet(req.query.user);
    }

    function getTweet(user, max_id) {
        if (max_id) {
            T.get('statuses/user_timeline', {
                screen_name: user,
                count: 200,
                include_rts: 1,
                exclude_replies: false,
                max_id: max_id
            }, tweeted);
        } else {
            T.get('statuses/user_timeline', {
                screen_name: user,
                count: 200,
                include_rts: 1,
                exclude_replies: false
            }, tweeted);
        }
    }

    function tweeted(err, data, response) {
        if (err) {
            console.log(err)
        } else {
            console.log('Success: ');
            data.forEach(function(e, i) {
                // console.log("Tweet " + i);
                // console.log("Text " + e.text);
                generator.feed(e.text);
                tweetCounter++;
            })
            console.log(tweetCounter);
            if (tweetCounter > tweetsToTrain) {
                var result = {
                    tweet: generator.generate(Number(req.query.max))
                }
                console.log("Number of ngrams: " + Object.keys(generator.ngrams).length)
                lastSavedIdUser = data[data.length - 1].id - 1;
                res.send(result);
            } else {
                getTweet(req.query.user, data[data.length - 1].id - 1);
            }

            // console.log(data);
        }
    }
}

app.get('/generateOnly', generateOnly);

function generateOnly(req, res) {
    var result = null;
    if (generator == null) {
        result = {
            tweet: 'Please train at least once'
        }
    } else {
        result = {
            tweet: generator.generate(Number(req.query.max))
        }
    }
    res.send(result);
}


app.get('/generatestream', generateStream);

var generatorStream = null;

var lastSavedId = null;

function generateStream(req, res) {

    console.log("Got request with " + req.query.phrase);

    var tweetsToTrain = req.query.train;

    var phrase = req.query.phrase;
    var regex = new RegExp("^" + phrase);

    var amountOfWords = phrase.split(' ').length;

    // generatorStream = new markov.Generator(amountOfWords, 30);

    if (req.query.reset == 'true') {
        console.log("Markov Reset");
        createMarkov(req.query.word, req.query.n, req.query.max)
    } else if (generatorStream == null) {
        console.log("Markov first time");
        createMarkov(req.query.word, req.query.n, req.query.max)
    } else {
        console.log("Markov not reset");
    }

    function createMarkov(word, n, max) {
        if (word == 'false') {
            console.log('Created Markov by Char')
            generatorStream = new markovChar.Generator(Number(n), Number(max));
        } else {
            console.log('Created Markov by Word')
            generatorStream = new markov.Generator(Number(n), Number(max));
        }
    }

    var tweetCounter = 0;

    if(req.query.reset == 'false'){
      console.log("Keep training");
      getTweet(lastSavedId)
    } else {
      getTweet()
    }

    function getTweet(max_id) {
        if (max_id) {
            T.get('search/tweets', {
                q: phrase,
                count: 100,
                max_id: max_id
            }, tweeted);
        } else {
            T.get('search/tweets', {
                q: phrase,
                count: 100
            }, tweeted);
        }
    }

    function tweeted(err, data, response) {
        if (err) {
            console.log(err)
            if (tweetCounter > tweetsToTrain) {
                var result = {
                    tweet: generatorStream.generate(Number(req.query.max))
                }
                res.send(result);
            } else {
                getTweet(req.query.user, Number(data.statuses[data.statuses.length - 1].id_str) - 1);
            }
        } else {
            console.log('Success: ');
            data.statuses.forEach(function(e, i) {
                    // console.log("Tweet " + i);
                    // console.log(e.created_at + " " + e.text);
                    // if (regex.test(e.text)) {
                        generatorStream.feed(e.text);
                        tweetCounter++;
                    // }
                })
                // console.log(data);
            console.log(tweetCounter);
            if (tweetCounter > tweetsToTrain) {
                var result = {
                    tweet: generatorStream.generate(Number(req.query.max))
                }
                console.log("Number of ngrams: " + Object.keys(generatorStream.ngrams).length)
                lastSavedId = Number(data.statuses[data.statuses.length - 1].id_str);
                res.send(result);
            } else {
                getTweet(req.query.user, Number(data.statuses[data.statuses.length - 1].id_str) - 1);
            }
        }
    }
}

app.get('/generatestreamOnly', generateStreamOnly);

function generateStreamOnly(req, res) {
    var result = null;
    if (generatorStream == null) {
        result = {
            tweet: 'Please train at least once'
        }
    } else {
        result = {
            tweet: generatorStream.generate(Number(req.query.max))
        }
    }
    res.send(result);
}
