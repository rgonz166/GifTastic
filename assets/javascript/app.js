/* TODO
add a remove from favorites
    - populate checkbox only after a favorites has appeared
*/

//Initialize variables
var gifs = ['dog','cat'];
var buttonColors = ['primary','secondary','success','danger','warning','info','light'];
// Use this string to store id of gif
var favoriteGifs = [];
// Get DOM elements
var gifButtons = $('.gif-buttons');
var gifContainer = $('.gif-container');
var gifInput = $('#gif-input');
var toggled = false;

// Run when page loads
$(window).on('load',function(){
    // if localstorage is not empty then run this
    if(!(localStorage.getItem('favId') === null)){
        favoriteGifs = JSON.parse(localStorage.getItem('favId'));
    }
    // Show favorite button if favorite array contains anything
    if(favoriteGifs.length > 0){
        favoriteFunctions('add');
    }
    // Adds buttons to page from gifs array
    loadButtons();
});

// add-gif to array on click
$('#add-gif').on('click',function(e){
    // prevent button from refreshing page
    e.preventDefault();
    // if the input is empty, return nothing to avoid blank buttons
    if(gifInput.val().trim() === ''){
        return;
    }else{
        // else push the value into gifs array then run function to load buttons on page
        gifs.push(gifInput.val().trim());
    }
    gifInput.val('');
    // adds buttons according to what is stored in gifs array
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
        button.addClass('gif-button').addClass('btn').addClass('btn-outline-'+buttonColors[i%buttonColors.length]);
        // adds attribute of data-name with the name at that index
        button.attr('data-name', gifs[i]);
        // adds the name as the text of the button
        button.text(gifs[i]);
        // append button to gif buttons
        gifButtons.append(button);
    }
}

// When a gif button is clicked run this
$(document).on('click','.gif-button',function(){
    // query to search for gifs, get name of button clicked with the name of the query
    var gifQ = 'q="'+($(this).attr('data-name'))+'"';
    // key used for api
    var key = 'iflq4o1A7c7VD2FODJs0Hw2Q3dzfBKwy';
    var queryURL = 'https://api.giphy.com/v1/gifs/search?' + gifQ + '&api_key='+key+'&limit=10';
    displayGifs(queryURL);
});

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

            // Create a paragraph tag with Title of gif
            var titleString = results[i].title;
            titleString = titleString.replace(' GIF','');
            var pTitle = $('<p>').text(titleString);
            pTitle.addClass('gif-title');

            // Creating a paragraph tag with the result item's rating
            var pRating = $("<p>").text("Rating: [" + results[i].rating +"]");
            pRating.addClass('gif-rating');

            // Creating and storing an image tag
            var gifImage = $("<img>");
            gifImage.addClass('gif');
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", results[i].images.fixed_height_still.url);
            gifImage.attr('data-id', results[i].id);
            gifImage.attr('data-still',results[i].images.fixed_height_still.url);
            gifImage.attr('data-animate',results[i].images.fixed_height.url)
            gifImage.attr('data-state',"still");
            gifImage.attr('data-content', 'Added to Favorites');

            // Appending the paragraph and image tag to the animalDiv
            gifDiv.append(pTitle);
            gifDiv.append(pRating);
            gifDiv.append(gifImage);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            gifContainer.prepend(gifDiv);
        }
    });
}

// Toggle flag when add to favorite toggle is pressed
function toggleFavoriteButton(){
    // if toggle is true set it to false
    if(toggled){
        toggled = false;
    // if toggle is false set it to true
    }else{
        toggled = true;
    }
}

// when a gif image is clicked run this
$(document).on('click','.gif',function(){
    // store true or false of toggle
    var favoriteToggle = $('.fav-toggle');
    var specificGif = $(this);
    // if toggle is true, then run this
    if(toggled){
        // if toggled then do not animate
        // show favorite button and delete all favorite button on page
        if(favoriteGifs.length == 0){
            favoriteFunctions('add');
        }
        // push the gif id to local favorite gifs array
        favoriteGifs.push($(this).attr('data-id'));
        // then store favorite gifs array into localStorage to save even after reloading
        localStorage.setItem("favId",JSON.stringify(favoriteGifs));
        specificGif.popover('show');
        console.log('hide in 3 secs');
        
        setTimeout(function(){
            specificGif.popover('hide');
        }, 1500);
        
    // If not toggled run this
    }else{
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        // Else set src to the data-still value
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    }
});

// function that contains everything with favorites
var favoriteFunctions = function(option){
    if(option === 'add'){
        addToPage('#main-buttons','<button>','favorites','btn btn-info','Favorites');
        addToPage('#main-buttons','<button>','clearAllFav','btn btn-danger','Clear Favorites');
    }
    else if(option === 'delete'){
        localStorage.clear();
        favoriteGifs = [];
        $('#favorites').remove();
        $('#clearAllFav').remove();
    }
}

// function to add buttons to page

    function addToPage(whichElement, addElement, addid, addclass, addtext){
        var elem = $(addElement);
        elem.attr('id', addid);
        elem.attr('class', addclass);
        elem.text(addtext);
        $(whichElement).append(elem);
    }


$(document).on('click','#favorites',function(e){
    e.preventDefault();
    favoriteGifs = JSON.parse(localStorage.getItem('favId'));
    
    var favoriteQ = 'https://api.giphy.com/v1/gifs?api_key=dc6zaTOxFJmzC&ids='+favoriteGifs+'';
    displayGifs(favoriteQ);
});

$(document).on('click','#clearAllFav',function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to clear all your favorites?')){
        favoriteFunctions('delete');
    }
})

$(document).on('click','#clear-gifs',function(e){
    e.preventDefault();
    gifContainer.empty();
})

// Function to reset page of buttons and gifs
function resetPage(){
    gifButtons.empty();
    gifContainer.empty();
    // sets array to empty
    gifs = [];
}
