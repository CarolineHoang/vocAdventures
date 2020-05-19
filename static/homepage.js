// Author: Caroline Hoang
// HTML for the Homepage to show the most recent 10 or show search results
//
// Found at the / route
// [A UI Design Project]


// GLOBAL VARIABLE(S) ==========================================================
var ids_to_search = [];
var searchSubstring = "";
var entries = [];
var salesList = [];


// AJAX CALL(S) ================================================================

var search = function(search_name){
    var searchVal=search_name.trim();
    if (search_name.length == 0){
        $("#text-warning0").removeClass("hide-object").addClass("show-object");
        $("#space-warning0").removeClass("show-object").addClass("hide-object");
    }
    else if (searchVal.length != search_name.length && searchVal.length == 0){
        $("#space-warning0").removeClass("hide-object").addClass("show-object");
        $("#text-warning0").removeClass("show-object").addClass("hide-object");
    }
    else{
        $("#space-warning0").removeClass("show-object").addClass("hide-object");
        $("#text-warning0").removeClass("show-object").addClass("hide-object");
    }
    
    var name_to_search = {"name": searchVal};      
    $.ajax({
        type: "POST",
        url: "search",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(name_to_search),
        success: function(result){
            searchSubstring = searchVal;
            ids_to_search = {"search_ids": result["search_ids"]};
            $("#results-count").html("Found "+ ids_to_search["search_ids"].length + " result(s).")
            $("#resultsContainer").addClass("counter")
            show_producers();
            $("#navSearch").val("");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 

var searchMostRecent = function(entriesNum){
    var num_of_entries = {"entriesNum": entriesNum};      
    $.ajax({
        type: "POST",
        url: "searchMostRecent",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(num_of_entries),
        success: function(result){
            display_producer_list(result["display_producers"])
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var show_producers = function(){
    $.ajax({
        type: "POST",
        url: "show_producer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(ids_to_search),
        success: function(result2){
            display_producer_list(result2["display_producers"])
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}


// OTHER HELPER FUNCTION(S) ====================================================


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function styleSearchString( string){
    var querystr = searchSubstring;
    var result = string;
    var reg = new RegExp(querystr, 'gi');
    var final_str =  " " + result.replace(reg, function(str) {return '<span class="searchIndication">'+str+'</span>'});
    return final_str
}

function makeCardEntries( entryJSON ){
    if (entryJSON != undefined || entryJSON != null){
        entries = entryJSON.map(function(s, index){
            var vocaloids= []
            s.vocaloids.forEach(function(val, idx){
                vocaloids.push(styleSearchString( val["name"]))
            })
            var searchName = styleSearchString( s.name );
            var card = $(   "<div class='card mb-3' >" +
                                "<div class='row no-gutters'>"+
                                    "<div class='col-md-2'>"+
                                    "<a href='/view/"+s.id+"'> <img src='" + s.profileImg + "' class='card-img' alt='Producer "+ s.name + "&#39;s profile icon on social media'> </a>"+
                                    "</div>"+
                                    "<div class='col-md-10'>"+
                                    "<div class='card-body'>"+
                                        "<h5 class='card-title searchFont '>"+searchName+ "</h5>"+
                                    "<br/><br/><br/> <p class='card-text'><small class='vocaloidList'><u>Vocaloids used:</u>   <div>"+ vocaloids+"</div> </small></p>"+
                                " </div>"+
                                    "</div>"+
                                "</div>"+
                        " </div>"
                        );
            return card; 
        })
    }
    else{
        return null;
    }
}

var display_producer_list = function(sales){
    salesList =sales;
    console.log(sales);
    makeCardEntries( salesList );
    $("#entries").empty();   //clear out HTML elements representing old rows before update
    //generate new HTML rows
    if (entries==[] || entries[0]== null ){
        $("#no-results").addClass("appear").removeClass("hide-object")
    }
    else{
        entries.forEach(function(c){
            $("#no-results").removeClass("appear").addClass("hide-object")
            $("#entries").prepend(c)
        })
    }
    $("#entries").prepend(makeCardEntries( ))
}


// MAIN FUNCTION ===============================================================

//Main program:
$(document).ready(function(){

    console.log(window.location.pathname)
    console.log(document.referrer)
    var query = getUrlParam('query','');
    if (query != ''){
        searchQuery = query;
        console.log(query)
        search(searchQuery)
        console.log(display_producer_list.length,display_producer_list)
    }
    else{
        searchMostRecent(10);
    }
    $("#navSearch").on("input", function(){
            console.log("this is the value of the search: " + $("#navSearch").val())
    })
    $("#navSearchButton").on("click", function(){
        console.log("this is the value of the search: "+ $("#navSearch").val())
    })

    $("#navSearchButton").on("click", function(){
        search($("#navSearch").val())
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