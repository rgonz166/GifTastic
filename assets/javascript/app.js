/*

Add functionality for getting values from inputs

use jQuery to append buttons to top of page

(try to have mobile uses search on top)

have press of button remove the gifs and append new gifs to page ( or just prepend and keep the old ones in the bottom)

add a event.preventDefault() because using submit button

*/
//Initialize variables
var gifs = ["cat","dog"];

// Get DOM elements
var gifButtons = $('.gif-buttons');
var gifContainer = $('.gif-container');
var gifInput = $('#gif-input');

$(window).on('load',function(){
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
        // adds class called gif
        button.addClass('gif');
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
    })
});




// Function to reset page of buttons and gifs
function resetPage(){
    gifButtons.empty();
    gifContainer.empty();
    // sets array to empty
    gifs = [];
}
