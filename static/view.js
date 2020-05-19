// Author: Caroline Hoang
// JS functionality for the view page to view producer info by id
// On this page, the user can also edit and update data
//
// Found at the /view/<idVal> route
// [A UI Design Project]

// GLOBAL VARIABLE(S) ==========================================================
var vocaloids_to_add = [];


// AJAX CALL(S) ================================================================
var update_array = function(){
    ids_to_search = {   "search_ids": idVal, 
                        "array": vocaloids_to_add
                    };
    $.ajax({
        type: "POST",
        url: "/<"+idVal+">/update_array",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(ids_to_search),
        success: function(result2){

        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var update_desc = function(){
    ids_to_search = {   "search_ids": idVal, 
                        "newName": $("#name-update").val(),
                        "newDesc": $("#desc-update").val(),
                        "newStartYear": $("#startYear-update").val(),
                        "newSongNum": $("#songNum-update").val()
                    };
    $.ajax({
        type: "POST",
        url: "/<"+idVal+">/update_desc",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(ids_to_search),
        success: function(result2){
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

var makeRow= function(v, index){
    var value = $("<div>"+v["name"]+"</div>").addClass("col-md-6") 
    var row = ($("<li id='vRow"+index+"'></li>").addClass("row")).append( value, $("<button id='vbutton"+index+"' value="+index+" class='delVoca' >X</button>").addClass("col-md-1 voca-delete-button"))
    return row
}

var renderVocaloids= function(){
    var renderedVoca = vocaloids_to_add.map(function(v, index){

        if (!v["mark_as_deleted"]){
 
            return makeRow(v, index);
        }
    });
    $("#voca-entries").empty();
    renderedVoca.forEach(function (v1){
        $("#voca-entries").append(v1)
    })
}

//error checking with warnings has not been implemented on this page. 
//For now, numbers will truncate to the last valid digit if it's a string.
//This function is for future implementation
//check for only positive integer numbers and 0 with regEx
function isPositiveInteger(strInt) {
    return /^(0|[1-9]\d*)$/.test(strInt); // the conditional considers 0, without 0 it would be:
                                          //    return /^[1-9]\d*$/.test(strInt);
}


// MAIN FUNCTION ===============================================================

$(document).ready(function(){

    console.log("display producers: " , display_producers) 

    vocaloids_to_add = display_producers[0]['vocaloids']
    console.log("vocaloids_to_add: " , vocaloids_to_add) 

    var display_vocaloids = []
        vocaloids_to_add.forEach(function(val, index){
            console.log(val["mark_as_deleted"], val)
            if (!val["mark_as_deleted"]){
            console.log(val["name"])
            display_vocaloids.push(val["name"])
            }
        })
    $("#vocals").text(display_vocaloids) 
    renderVocaloids();

    // these IDs may look out of place but these are from the navbar, not view.html
    $("#update-entry").click(function(){
        $("#n_editing-buttons").removeClass("n_show-editing-buttons").addClass("n_hide-editing-buttons");
        update_desc();
    });

    // these IDs may look out of place but these are from the navbar, not view.html
    $(".update").click(function(){
        $(this).addClass("hide-warning")
        $("#n_editing-buttons").removeClass("n_hide-editing-buttons").addClass("n_show-editing-buttons");
        console.log($(this).val())
        console.log($("#name-update").val())

        $("#"+$(this).val()+"-update").attr("disabled", function(idx, value) { return !value; })
        $("#"+$(this).val()+"-update").focus();
    });

    $("#add-vocaloid").click(function(undoVal = null){
        vocaloidInputField = $("#vocaloids-input").val()
        console.log(vocaloids_to_add)
    
        if (vocaloidInputField.length === 0) {
            $("#arr-text-warning"+0).removeClass("hide-warning").addClass("show-warning")
            $("#arr-space-warning"+0).removeClass("show-warning").addClass("hide-warning")
            $("vocaloids-input").focus();
        }
        else if ((vocaloidInputField.trim()).length === 0) {
            $("#arr-space-warning"+0).removeClass("hide-warning").addClass("show-warning")
            $("#arr-text-warning"+0).removeClass("show-warning").addClass("hide-warning")
            $("vocaloids-input").focus();
        }
        else{
            $("#arr-text-warning"+0).removeClass("show-warning").addClass("hide-warning")
            $("#arr-space-warning"+0).removeClass("show-warning").addClass("hide-warning")
            $("#array-warning0").removeClass("show-warning").addClass("hide-warning")

        vocaloids_to_add.push({"name": $("#vocaloids-input").val(), "mark_as_deleted": false }); //
        update_array();
        renderVocaloids();

        $("#vocaloids-input").val("");
        }
    });

    $("#voca-entries").on("click", "button.voca-delete-button",function(){
        $("#vRow"+$(this).val()).html("<button class='undoDelVoca' value="+$(this).val()+"> undo delete </button")
        vocaloids_to_add[$(this).val()]["mark_as_deleted"]=true

        console.log(vocaloids_to_add)
        update_array();
        
    });

    $("#voca-entries").on("click", "button.undoDelVoca",function(){
        console.log("clicked button:",$(this).val() )
        console.log(vocaloids_to_add[$(this).val()])

        vocaloids_to_add[$(this).val()]["mark_as_deleted"]=false;
        var value = $("<div>"+vocaloids_to_add[$(this).val()]["name"]+"</div>").addClass("col-md-6") 
        var index =$(this).val()
        $("#vRow"+$(this).val()).empty().append( value, $("<button id='vbutton"+index+"' value="+index+" class='delVoca' >X</button>").addClass("col-md-1 voca-delete-button"))
        update_array();
    });
})



