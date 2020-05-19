// Author: Caroline Hoang
// Simple Bootstrap Navbar

// This navbar is the base of the template structure and, 
// on the view page, it holds the edit buttons.
// This is so that the buttons stay on the top of the page and move with the navbar.
// This navbar also holds the search bar used to search on the Homepage (or from any page).

// [A UI Design Project] 


var ids_to_search = [1,4,5];

$(document).ready(function(){

    console.log(window.location.pathname)
    console.log(document.referrer)
    console.log(window.location.pathname == "/")

    //On GO, send search and go to homepage
    $("#navSearchButton").on("click", function(){
        if (window.location.pathname != "/" && $("#navSearch").val() && $("#navSearch").val().trim() ){

            console.log("route: " + document.location.pathname)
            document.location.href = '/?query='+$("#navSearch").val().trim() ;
        }
    })
})

$(document).ready(function(){
    // pressing enter to submit the form
    $("#navSearch").keyup(function(event){
        if (event.key == "Enter"){
                $("#navSearchButton").click(); //trigger button click event behavior
        }
    })
})