

function init(){
  $('#generateTweet').click(function(){
    var screen_name = $("#screenName").val();
    var resetMarkov = $('#generateTweetReset').is(':checked');
    var byWord = $('#generateTweetWord').is(':checked');
    var n = $('#n').val();
    var max = $('#length').val();
    var tweetsToTrain = $('#amountOfTweets').val();
    $.getJSON('/generate', {user: screen_name, reset: resetMarkov, word: byWord, n: n, max: max, train: tweetsToTrain}, function(data){
      console.log(data);
      $("#generatedTweet").text(data.tweet);
    })
  })

  $('#generateTweetOnly').click(function(){
    var max = $('#length').val();
    $.getJSON('/generateOnly', {max: max}, function(data){
      $("#generatedTweet").text(data.tweet);
    })
  })

  $('#generateTweetStream').click(function(){
    var phrase = $("#phrase").val();
    var resetMarkov = $('#generateTweetReset').is(':checked');
    var byWord = $('#generateTweetWord').is(':checked');
    var n = $('#n').val();
    var max = $('#length').val();
    var tweetsToTrain = $('#amountOfTweets').val();
    $.getJSON('/generatestream', {phrase: phrase, reset: resetMarkov, word: byWord, n: n, max: max, train: tweetsToTrain}, function(data){
      console.log(data);
      $("#generatedTweetStream").text(data.tweet);
    })
  })

  $('#generateTweetStreamOnly').click(function(){
    var max = $('#length').val();
    $.getJSON('/generatestreamOnly', {max: max}, function(data){
      $("#generatedTweetStream").text(data.tweet);
    })
  })


  // var socket = io.connect();
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
}

window.addEventListener('load',init);
