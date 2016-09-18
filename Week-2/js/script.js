$( document ).ready(function(){
  var vocals = [65, 69, 73, 79, 85, 97, 101, 105, 111, 117];
  $("#shiftingBtn").click(function(){
    doSplitText();
    var input = $("#inputField").val();
    var output = "";
    for(var i = 0; i < input.length; i++){
      var charCode = input.charCodeAt(i);
      if(charCode == 32 || (!$("#vowels").is(":checked") && $.inArray(charCode, vocals) != -1)){
        output += String.fromCharCode(charCode);
      } else{
        output += String.fromCharCode(charCode + 5);
      }
    }
    $("#result").text(output);
  });

  $("#orderingBtn").click(function(){
    doSplitText();
    var input = $("#inputField").val();
    var regex = /["'(]*\b\w+\b[)'",.\w]*/g;
    var results = input.match(regex);
    console.log(results);
    var listWithKeyCode = [];
    var wordArray = [];
    results.forEach(function(e, i){
      var wordValue = 0;
      for(var i = 0; i < e.length; i++){
        var charCode = e.charCodeAt(i);
        wordValue += charCode;
      }

      var wordFinish = { key: wordValue, val: e}
      if(!$("#dublicates").is(":checked")){
        if($.inArray(e, wordArray) == -1){
          listWithKeyCode.push(wordFinish);
          wordArray.push(e);
        }
      }else{
        listWithKeyCode.push(wordFinish);
      }
    })

    listWithKeyCode = listWithKeyCode.sort(function (a, b) {
      return b.key - a.key ;
    });

    var output = "";
    $.each(listWithKeyCode, function(index, obj){
      output += obj.val;
      output += " ";
    })
    $("#result").text(output);
  });

  function doSplitText(){
    var input = $("#inputField").val();
    var words = input.split(/(\W+)/);

    console.log(words);
    $.each(words, function(i, e){
      if(e != " "){
        var span = $("<span>" + e + "</span>");
        span.click(spanClicked);
        span.hover(spanRightClicked);
        $("#splitText").append(span);
      }else{
        $("#splitText").append("<span> </span>");
      }
    })
  }

  function spanClicked(e){
    var word = this.innerHTML;
    var keyCodeSum = 0;
    for(var i = 0; i < word.length; i++){
      keyCodeSum += word.charCodeAt(i);
    }
    this.innerHTML = "" + keyCodeSum;
    console.log(this.innerHTML);
  }

  function spanRightClicked(e){
    e.preventDefault();
    var word = this.innerHTML;
    var keyCodeSum = 0;
    for(var i = 0; i < word.length; i++){
      keyCodeSum += word.charCodeAt(i);
    }
    this.style.backgroundColor = "rgb(" + keyCodeSum + "," + (keyCodeSum - 255) + "," + (keyCodeSum - 510) + ")";
  }
});
