/*

Add functionality for getting values from inputs

use jQuery to append buttons to top of page

(try to have mobile uses search on top)

have press of button remove the gifs and append new gifs to page ( or just prepend and keep the old ones in the bottom)

add a event.preventDefault() because using submit button

*/
//Initialize variables
var gifs = [];
var buttonColors = ['primary','secondary','success','danger','warning','info','dark'];
var favoriteGifs = [];

// Get DOM elements
var gifButtons = $('.gif-buttons');
var gifContainer = $('.gif-container');
var gifInput = $('#gif-input');

$(window).on('load',function(){
    if(favoriteGifs.length > 0){
        loadFav();
    }
    loadButtons();
});

// add-gif to array on click
$('#add-gif').on('click',function(e){
    // prevent button from refreshing page
    e.preventDefault();
    gifs.push(gifInput.val().trim());
    loadButtons();
});

function loadButtons(){
    // remove existing buttons first
    gifButtons.empty();
    // then add new buttons from array
    for(var i=0;i<gifs.length;i++){
        // creates button
        var button = $('<button>');
        button.attr('type','button');
        // adds class called gif
        button.addClass('gif').addClass('btn').addClass('btn-'+buttonColors[i%buttonColors.length]);
        // adds attribute of data-name with the name at that index
        button.attr('data-name', gifs[i]);
        // adds the name as the text of the button
        button.text(gifs[i]);
        // append button to gif buttons
        gifButtons.append(button);
    }
}

$(document).on('click','.gif',function(){
    var gifQ = $(this).attr('data-name');
    var key = 'iflq4o1A7c7VD2FODJs0Hw2Q3dzfBKwy';
    var queryURL = 'https://api.giphy.com/v1/gifs/search?q="' + gifQ + '"&api_key='+key+'&limit=10'
    $.ajax({
        url:queryURL,
        method: "GET"
    }).then(function(res){
        console.log(res);
        var results = res.data;
        // Looping through each result item
        for (var i = 0; i < results.length; i++) {

            // Creating and storing a div tag
            var gifDiv = $("<div>");
            gifDiv.addClass('single-gif');

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: [" + results[i].rating +"]");
            p.addClass('rating');

            // Creating and storing an image tag
            var gifImage = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", results[i].images.fixed_height.url);

            // Appending the paragraph and image tag to the animalDiv
            gifDiv.append(p);
            gifDiv.append(gifImage);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            gifContainer.prepend(gifDiv);
        }
    });
});




// Function to reset page of buttons and gifs
function resetPage(){
    gifButtons.empty();
    gifContainer.empty();
    // sets array to empty
    gifs = [];
}
