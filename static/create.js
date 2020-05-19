// Author: Caroline Hoang
// JS functionality for the create page to create a new Vocaloid Producer
//
// Found at the /create route
// [A UI Design Project]


// GLOBAL VARIABLE(S) ==========================================================
var entries = [];
var vocaloids_to_add = [];
var lastId;

testVal =9;



// AJAX CALL(S) ================================================================

//*********** ------------------ SAVE PRODUCER -------------------- ************
var save_producer = function(new_sale){
    var data_to_save = new_sale;      
    $.ajax({
        type: "POST",
        url: "save_producer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data_to_save),
        success: function(result){
            $("#failure").addClass("hide").removeClass("show")
            lastId = result["idVal"];
            
            $("#view-new").attr("href", "/view/"+lastId);
            $("#view-entry").removeClass("hide").addClass("show");
            $("#success-notif").removeClass("hide").addClass("show");
        },
        error: function(request, status, error){
            $("#failure").addClass("show").removeClass("hide")
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 


// OTHER HELPER FUNCTION(S) ====================================================

//check for only positive integer numbers and 0 with regEx
function isPositiveInteger(strInt) {
    
    return /^(0|[1-9]\d*)$/.test(strInt); // the conditional considers 0, without 0 it would be:
                                          //    return /^[1-9]\d*$/.test(strInt);
}


// MAIN FUNCTION ===============================================================

//Main program:
$(document).ready(function(){

    //ADD an entry
    $("#add-entry").click(function(){
        
        //variables to update with
        var name = $("#name-input").val() 
        var startYear = $("#startYear-input").val()
        var songNum = $("#songNum-input").val()
        var desc = $("#desc-input").val()
        // var vocaloids= $("#vocaloids-input").val()
        var profileImg= $("#profileImg-input").val()
        var textInputs = [name, desc, profileImg].reverse();
        var intInputs = [startYear, songNum].reverse();
        // var allInputs = [name, desc,startYear, songNum ,vocaloids_to_add, profileImg].reverse();

        //deactivate all warnings
        $("#text-warning1").removeClass("show").addClass("hide")
        $("#text-warning3").removeClass("show").addClass("hide")
        $("#text-warning5").removeClass("show").addClass("hide")
        $("#space-warning1").removeClass("show").addClass("hide")
        $("#space-warning3").removeClass("show").addClass("hide")
        $("#space-warning5").removeClass("show").addClass("hide")
        $("#num-warning4").removeClass("show").addClass("hide")
        $("#num-warning6").removeClass("show").addClass("hide")
        $("#success-notif").removeClass("show").addClass("hide")
        //missing th array warnings


        //if both fields have valid input, update model and then the view
        if (  /*true || */( (((name).trim()).length != 0)  && (((desc).trim()).length != 0) && (((profileImg).trim()).length != 0)&& (startYear.length != 0 )&& (songNum.length != 0 )) 
                                   && (isPositiveInteger(startYear.trim()) ) && (isPositiveInteger(songNum.trim()) ) 
                                   && (vocaloids_to_add.length > 0)      ){  //we trim so we can accept numbers with starting spaces
            
            //*********** ------------------  SAVE an entry  --------------------- ************

            //UPDATE MODEL:
            //add a new "row" of information to saleslist JSON list
            save_producer(                
                {
                    "name": name,
                    "startYear": parseInt(startYear,  10),
                    "songNum": parseInt(songNum,  10),
                    "desc": desc,
                    "vocaloids": vocaloids_to_add, // vocaloids,
                    "profileImg": profileImg
                }
            )
            //clear input values when values passed
            $("#name-input").val("");
            $("#desc-input").val("");
            $("#startYear-input").val("");
            $("#songNum-input").val("");
            $("#vocaloids-input").val("");
            $("#profileImg-input").val("");
            $("#entries").html("");
            vocaloids_to_add =[];



            //put focus back on the the #name-input field
            $("#name-input").focus();
        }

        else{
            //handle the display of warnings
            //note, the name group is on the bottom so it will fire last and take priority if they are both wrong

            //handle all error displays pertaining to and put focus on #number fields
            //if num field is empty is not a valid, positive integer or zero


            //This is done with plain javascript instead of jquery. If I would like to instead do it with jquery, I'd need to use filters.
            for ( idx = document.forms[0].length -1 ; idx>-1; idx-- ){
                console.log(idx, document.forms[0][idx].getAttribute("formType"), document.forms[0][idx].value) ;

                if (document.forms[0][idx].getAttribute("formType")=="input"){
                    if (document.forms[0][idx].getAttribute("dataType")=="text"){
                        
                            if (document.forms[0][idx].value.length === 0) {
                                $("#text-warning"+(idx)).removeClass("hide").addClass("show")
                                $("#space-warning"+(idx)).removeClass("show").addClass("hide")
                                $(document.forms[0][idx]).focus();
                            }
                            else if ((document.forms[0][idx].value.trim()).length === 0) {
                                $("#space-warning"+(idx)).removeClass("hide").addClass("show")
                                $("#text-warning"+(idx)).removeClass("show").addClass("hide")
                                $(document.forms[0][idx]).focus();
                            }
                            else{
                                $("#text-warning"+(idx)).removeClass("show").addClass("hide")
                                $("#space-warning"+(idx)).removeClass("show").addClass("hide")
                            }
                    }
                    else if (document.forms[0][idx].getAttribute("dataType")=="integer"){
                        intInputs.forEach(function(x, i){
                
                            if ((document.forms[0][idx].value.length)==0 || !isPositiveInteger(document.forms[0][idx].value.trim()) ) {
                                $("#num-warning"+(idx)).removeClass("hide").addClass("show")
                                $(document.forms[0][idx]).focus();
                            }
                            //#num field is correct, remove all error displays
                            else{
                                $("#num-warning"+(idx)).removeClass("show").addClass("hide")
                            }
                        })

                    }
                    else if (document.forms[0][idx].getAttribute("dataType")=="array"){
                        if (vocaloids_to_add.length<=0){
                            $("#array-warning0").removeClass("hide").addClass("show");
                            $("#vocaloids-input").focus();
                        }
                        else{
                            $("#array-warning0").removeClass("show").addClass("hide")
                        }
                    }
                }
            }
        }   
        console.log("length:   " + document.forms[0].length )
    })
    $("#add-vocaloid").click(function(){
        vocaloidInputField = $("#vocaloids-input").val()

        if (vocaloidInputField.length === 0) {
            $("#arr-text-warning"+0).removeClass("hide").addClass("show")
            $("#arr-space-warning"+0).removeClass("show").addClass("hide")
            $("vocaloids-input").focus();
        }
        else if ((vocaloidInputField.trim()).length === 0) {
            $("#arr-space-warning"+0).removeClass("hide").addClass("show")
            $("#arr-text-warning"+0).removeClass("show").addClass("hide")
            $("vocaloids-input").focus();
        }
        else{
            $("#arr-text-warning"+0).removeClass("show").addClass("hide")
            $("#arr-space-warning"+0).removeClass("show").addClass("hide")
            $("#array-warning0").removeClass("show").addClass("hide")
        
        console.log("vocaloid before: " ,vocaloids_to_add)
        vocaloids_to_add.push({"name":vocaloidInputField, "mark_as_deleted": false });
        console.log("vocaloid after: " ,vocaloids_to_add)
        var renderedVoca = vocaloids_to_add.map(function(v, index){
            console.log("vocaloid name: " ,v["name"])
            
            var value = $("<div>"+v["name"]+"</div>").addClass("col-md-2") 
            var row = ($("<li id='vRow"+index+"'></li>").addClass("row")).append( value, $("<button id='vbutton"+index+"' value="+index+">X</button>").addClass("col-md-1 voca-delete-button"))
            return row;
        });
        $("#entries").empty();
        renderedVoca.forEach(function (v1){
            $("#entries").append(v1)
        })
        $("#vocaloids-input").val("");
        }
    });

    $("#entries").on("click", "button.voca-delete-button",function(){
        $("#vRow"+$(this).val()).remove()
        vocaloids_to_add.splice($(this).val(),1)
    });
})

$(document).ready(function() {
    var activeElem =null;
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            console.log($(document.activeElement).attr("id"))
            if ($(document.activeElement).attr("id") != null && $(document.activeElement).attr("id") != undefined){
                activeElem = $(document.activeElement).attr("id");
            }
            else{
                console.log("active element: " + activeElem)
            }
            if (activeElem != null && activeElem == "vocaloids-input"){
                $("#add-vocaloid").click();
            }
        }
    });
});
