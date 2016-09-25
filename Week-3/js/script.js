var lexicon;

$( document ).ready(function(){
  lexicon = new RiLexicon();

  $.getJSON("small.json", function(data) {

    console.log(data);
    var listOfPos = data.listOfPos;
    listOfPos.forEach(function(e,i){
      $("#buttons").append(
        '<div class="col-md-3">' +
          '<button class="addPos btn btn-default btn-lg" id="' + e.tag + '" name="' + e.tag + '"><h5>' + e.description + ' (' + e.tag + ')</h5></button>' +
        '</div>'
      )
    })

    $(".addPos").click(function(e){
      console.log(this.attributes[1].value)
      $( "#sortable" ).append("<span class='box " + this.attributes[1].value + "' name='" + this.attributes[1].value + "'></span>");
    })

  })

  $("#shiftingBtn").click(function(){
    var input = $("#inputField").val();
    var rs = new RiString(input);
    console.log(rs.analyze());
    $("#sentenceResult").append("<p>" + rs.analyze()._features.pos + "</p>");
  })

  // $("#noun").click(function(){
  //   $( "#sortable" ).append("<span class='box nn' name='nn'></span>");
  // })
  //
  // $("#adjective").click(function(){
  //   $( "#sortable" ).append("<span class='box jj' name='jj'></span>");
  // })

  $("#go").click(function(){
    var elements = $("#sortable").children();
    $( "#result" ).empty();
    elements.each(function(i,e){
      console.log(e.attributes[1].value);
      $( "#result" ).append("<span class='resultText'>" + lexicon.randomWord(e.attributes[1].value) + "</span>");
      $( "#result" ).append("<span class='resultText'> </span>");
    })
    // spanELEMENT.attributes[1].value
  })

  $( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );

});
