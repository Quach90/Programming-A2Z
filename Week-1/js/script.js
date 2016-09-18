$( document ).ready(function(){
  var vocals = [65, 69, 73, 79, 85, 97, 101, 105, 111, 117];
  $("#shiftingBtn").click(function(){
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
    var input = $("#inputField").val();
    var listWithKeyCode = [];
    var wordArray = [];
    var output = "";
    var wordValue = 0;
    var word = "";
    for(var i = 0; i < input.length; i++){
      var charCode = input.charCodeAt(i);
      if(charCode == 32 || i+1 == input.length){
        //For the last word
        if(i+1 == input.length){
          wordValue += charCode;
          word += input.charAt(i);
        }
        var wordFinish = { key: wordValue, val: word}
        if(!$("#dublicates").is(":checked")){
          if($.inArray(word, wordArray) == -1){
            listWithKeyCode.push(wordFinish);
            wordArray.push(word);
          }
        }
        else{
          listWithKeyCode.push(wordFinish);
        }
        wordValue = 0;
        word = "";
      } else{
        wordValue += charCode;
        word += input.charAt(i);
      }
    }

    listWithKeyCode = listWithKeyCode.sort(function (a, b) {
      return b.key - a.key ;
    });

    $.each(listWithKeyCode, function(index, obj){
      output += obj.val;
      output += " ";
    })
    $("#result").text(output);
  });
});
