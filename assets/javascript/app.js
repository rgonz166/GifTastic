/*

Add functionality for getting values from inputs

use jQuery to append buttons to top of page

(try to have mobile uses search on top)

have press of button remove the gifs and append new gifs to page ( or just prepend and keep the old ones in the bottom)

add a event.preventDefault() because using submit button

*/
//Initialize variables
var gifs = ['dog','cat'];
var buttonColors = ['primary','secondary','success','danger','warning','info','dark'];
// Use this string to store id of gif
var favoriteGifs = [];
// Get DOM elements
var gifButtons = $('.gif-buttons');
var gifContainer = $('.gif-container');
var gifInput = $('#gif-input');
var toggled = false;


$(window).on('load',function(){
    // if localstorage is empty then run this
    if(!(localStorage.getItem('favId') === null)){
        favoriteGifs = JSON.parse(localStorage.getItem('favId'));
        console.log('parsed',favoriteGifs);
    }
    
    // Show favorite button if favorite array contains anything
    if(favoriteGifs.length > 0){
        addFavButton();
    }
    loadButtons();
});

// add-gif to array on click
$('#add-gif').on('click',function(e){
    // prevent button from refreshing page
    e.preventDefault();
    
    if(gifInput.val().trim() === ''){
        return;
    }
    else{gifs.push(gifInput.val().trim());}
    gifInput.val('');
    loadButtons();
});

$(document).on('click','#favorites',function(e){
    e.preventDefault();
    favoriteGifs = JSON.parse(localStorage.getItem('favId'));
    // var favoriteIDs = favoriteGifs.join(',');
    console.log('fav id string', favoriteGifs);
    
    var favoriteQ = 'http://api.giphy.com/v1/gifs?api_key=dc6zaTOxFJmzC&ids='+favoriteGifs+'';
    displayGifs(favoriteQ);
});

$(document).on('click','.gif-button',function(){
    var gifQ = 'q="'+($(this).attr('data-name'))+'"';
    var key = 'iflq4o1A7c7VD2FODJs0Hw2Q3dzfBKwy';
    var queryURL = 'https://api.giphy.com/v1/gifs/search?' + gifQ + '&api_key='+key+'&limit=10';
    displayGifs(queryURL);
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
        button.addClass('gif-button').addClass('btn').addClass('btn-outline-'+buttonColors[i%buttonColors.length]);
        // adds attribute of data-name with the name at that index
        button.attr('data-name', gifs[i]);
        // adds the name as the text of the button
        button.text(gifs[i]);
        // append button to gif buttons
        gifButtons.append(button);
    }
}

function displayGifs(query){
    $.ajax({
        url:query,
        method: "GET"
    }).then(function(res){
        console.log(res);
        var results = res.data;
        // Looping through each result item
        for (var i = 0; i < results.length; i++) {

            // Creating and storing a div tag
            var gifDiv = $("<div>");
            gifDiv.addClass('gif-div');

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: [" + results[i].rating +"]");
            p.addClass('rating');

            // Creating and storing an image tag
            var gifImage = $("<img>");
            gifImage.addClass('gif');
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", results[i].images.fixed_height_still.url);
            gifImage.attr('data-id', results[i].id);
            gifImage.attr('data-still',results[i].images.fixed_height_still.url);
            gifImage.attr('data-animate',results[i].images.fixed_height.url)
            gifImage.attr('data-state',"still");

            // Appending the paragraph and image tag to the animalDiv
            gifDiv.append(p);
            gifDiv.append(gifImage);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            gifContainer.prepend(gifDiv);
        }
    });
}

function toggleFavoriteButton(){
    if(toggled){
        toggled = false;
    }else{
        toggled = true;
    }
}

function addFavButton(){
    console.log('fav array len',favoriteGifs.length);
    
        var favButton = $('<button>');
        favButton.attr('id','favorites');
        favButton.attr('class', 'btn btn-info');
        favButton.text('Favorites');
        $('#gif-form').append(favButton);
    
}

$(document).on('click','.gif',function(){
    var favoriteToggle = $('.fav-toggle');
    if(toggled){
        if(favoriteGifs.length == 0){
            addFavButton();
        }
        favoriteGifs.push($(this).attr('data-id'));
        localStorage.setItem("favId",JSON.stringify(favoriteGifs));
    }else{
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    }
});


// Function to reset page of buttons and gifs
function resetPage(){
    gifButtons.empty();
    gifContainer.empty();
    // sets array to empty
    gifs = [];
}
