"use strict";


function tplawesome(template, data) {
    // initiate the result to the basic template
    var res = template;
    // for each data key, replace the content of the brackets with the data
    for(var i = 0; i < data.length; i++) {
        res = res.replace(/\{\{(.*?)\}\}/g, function(match, j) { // some magic regex
            return data[i][j];
        })
    }
    return res;
}

// function remove all elements .item under #results
function deleteIframe() {
    $('#results').empty();
    console.log("removed frame");
}

// create OAuth v3
function init(name) {
    gapi.client.setApiKey("AIzaSyARabR52fikNNQGNw66-5MYvcJaWCZsZ3E");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
    var video_name = name;
    // store our string of video name
    $("#search").val(video_name);
    // push button
    buttonSubmit();
}

function buttonSubmit() {
    // click to button
    $('form').find('input[type="submit"]').click();
    // submit form
    $('form').submit(function(event) {
       //
       scrollTo("#search");
       event.preventDefault();
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 1
       });

        // execute the request
       request.execute(function(response) {
          var results = response.result;
          $("#results").html("");
          $.each(results.items, function(index, item) {
            $.get("tpl/item.html", function(data) {
                deleteIframe();
                //
                $("#results").append(tplawesome(data, [{ "title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });

          resetVideoHeight();
       });
    });
}

$(window).on("resize", resetVideoHeight);

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}


  // first we make sure annyang started succesfully
  if (annyang) {

    // define the functions our commands will run.
    var openModal = function() {
      $('#myModal').modal('show');
    };

    var close = function(){
        $('#myModal').modal('hide');
    };

    var stopVideo = function(){
        $('#results').empty();
        //first delete all iframes;
    };
    var remove = function(){
        $('#results').empty();
    };

    var scrollTop = function(){ 
        scrollTo("body")
    };
    var scrollDown = function(){ 
        scrollTo("#form")
    };

    // define our commands.
    // * The key is the phrase you want your users to say.
    // * The value is the action to do.
    //   You can pass a function, a function name (as a string), or write your function as part of the commands object.
    var commands = {
      'open box':           openModal,
      'close':              close,
      'play *search':       init,
      'remove':             remove,
      'stop':               stopVideo,
      'go home':            scrollTop,
      'go down':            scrollDown
    };

    // OPTIONAL: activate debug mode for detailed logging in the console
    annyang.debug();

    // Add voice commands to respond to
    annyang.addCommands(commands);

    // OPTIONAL: Set a language for speech recognition (defaults to English)
    // https://github.com/TalAter/annyang/blob/master/docs/README.md#languages
    annyang.setLanguage('en');
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();

  } else {
    console.log("unsupported");
  }
  // helper function for
  var scrollTo = function(identifier, speed) {
    $('html, body').animate({
        scrollTop: $(identifier).offset().top-100
    }, speed || 1000);
  };
