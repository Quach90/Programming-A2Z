var Twit = require('twit');

var config = require('./config.js');

var T = new Twit(config);

var markov = require('./markov');

var trainCounter = 0;

var phrase = "I feel like";
var regex = new RegExp("^"+ phrase);

var amountOfWords = phrase.split(' ').length;

var generatorStream = new markov.Generator(amountOfWords, 30);

T.get('search/tweets', {q: "I like", count: 2}, tweeted);

function tweeted(err, data, response){
  if(err){
    console.log(err)
  } else {
    console.log('Success: ');
    data.statuses.forEach(function(e,i){
      console.log("Tweet " + i);
      console.log(e.created_at + " " + e.text);
    })
    // console.log(data);
    console.log(data.statuses[data.statuses.length-1].id)
    T.get('search/tweets', {q: "I like", count: 2, max_id: Number(data.statuses[data.statuses.length-1].id_str) - 1}, tweetedTwice);
  }
}

function tweetedTwice(err, data, response){
  if(err){
    console.log(err)
  } else {
    console.log('Success: ');
    data.statuses.forEach(function(e,i){
      console.log("Tweet " + i);
      console.log(e.created_at + " " + e.text);
    })
    // console.log(data);
  }
}
