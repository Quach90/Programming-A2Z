var Twit = require('twit');

var config = require('./config.js');

var T = new Twit(config);

var markov = require('./markov');

var trainCounter = 0;

var phrase = "I feel like";
var regex = new RegExp("^"+ phrase);

var amountOfWords = phrase.split(' ').length;

var generatorStream = new markov.Generator(amountOfWords, 30);



// var stream = T.stream('statuses/filter', {
//     track: phrase
// })
// stream.on('tweet', gotTweet);
//
// console.log("Stream started");
//
// function gotTweet(tweet) {
//     console.log("Got tweet");
//     // Note that according to twitter docs: "Exact matching of phrases
//     // (equivalent to quoted phrases in most search engines) is not supported."
//     // So we filter ourselves here:
//
//     if (regex.test(tweet.text)) {
//         console.log('Feeding tweet: ' + tweet.text);
//         // generatorStream.feed(tweet.text);
//         // trainCounter++;
//         // if(trainCounter > 1000){
//         //   var result = {
//         //       tweet: generatorStream.generate()
//         //   }
//         //   stream.stop();
//         //   console.log(result);
//         // }
//     }
// }


/*
T.get('statuses/user_timeline', {screen_name: "shiffman", count: 1, include_rts:1, exclude_replies: false}, tweeted);

function tweeted(err, data, response){
  if(err){
    console.log(err)
  } else {
    console.log('Success: ');
    data.forEach(function(e,i){
      console.log("Tweet " + i);
      console.log("Text " + e.text);
    })
    console.log(data);
  }
}
*/

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
