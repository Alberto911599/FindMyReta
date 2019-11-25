// TODO edit and delete own retas
// Comments

// base url
let url = 'https://vast-forest-34191.herokuapp.com/api';


// new place to add
let myNewReta = {
    location : null,
    city : null,
    name : null,
    typeOfSports : null,
    cost : null,
    requisites : null,
    nowPlaying : false,
    imageURL: null,
    username : null,
    likes : 0,
    assistants : 0
}

// user currently logged in
let currentUser = {
    username : "", 
    city : ""
}

let updatableFields = ["location", "name", "typeOfSports", "cost", "requisites", "nowPlaying", "imageURL"];

// these are the fields used in search by term
let searchableFields = ["location", "name", "typeOfSports", "cost", "requisites"];

// This array stores the id of each of the items currently showed
let itemsId = [];

// The index holds the element to update or delete
let index = -1;

// esta variable permite llevar un control del grid
let numberOfCols = 4;

// image downsize parameters
let WIDTH = 200;
let HEIGHT = 130;
let encoderOptions = 0.90;

// google maps api autocomplete
let autocomplete;

function downscaleImage(image) {
    // Create a temporary canvas to draw the downscaled image on.
    let canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    // Draw the downscaled image on the canvas and return the new data URL.
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    return canvas.toDataURL("image/jpeg", encoderOptions);
}

function encodeImageFileAsURL(element) {
    let file = element.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        let image = new Image();
        image.width = WIDTH*2;
        image.height = HEIGHT*2;
        image.src = reader.result; 
        image.onload = function(){
            $("#imageDiv").append(image);
            myNewReta.imageURL = downscaleImage(image)
        }
    }
    reader.readAsDataURL(file);
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("locationInput"));
  
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);
  
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    let place = autocomplete.getPlace();
    console.log(place);
    for (let i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (addressType === "locality") {
        //   city = place.address_components[i].long_name
            myNewReta.city = place.address_components[i].long_name;
        }
    }
    console.log(myNewReta);
}

function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle(
            {center: geolocation, radius: position.coords.accuracy});
        autocomplete.setBounds(circle.getBounds());
      });
    }
}

function hideSections(){
    $(".addRetaSection").hide();
    $(".loginSection").hide();
    $(".allRetasSection").hide();
    $(".myRetasSection").hide();
    $(".detailsSection").hide();
}

function clearFields(){
    $("#locationInput").val('');
    $("#nameInput").val('');
    $("#typeOfSportsInput").val('');
    $("#costInput").val('');
    $("#requisitesInput").val('');
    $("#nowPlayingInput").val('');
    $("#searchInput").val('');
    $("#imageDiv").empty();
    index = -1;
}

function clearMyNewReta(){
    myNewReta = {
        location : null,
        city : null,
        name : null,
        typeOfSports : null,
        cost : null,
        requisites : null,
        nowPlaying : false,
        imageURL: null,
        username : null,
        likes : 0,
        assistants : 0
    }
}

function getInputValues(){
    myNewReta.location = $("#locationInput").val();
    myNewReta.name = $("#nameInput").val();
    myNewReta.typeOfSports =  $("#typeOfSportsInput").val();
    myNewReta.cost = $("#costInput").val();
    myNewReta.requisites = $("#requisitesInput").val();
    myNewReta.nowPlaying = $("#nowPlayingInput").is(':checked');
}

function isRelated(searchTerm, jsonCandidate){
    for(let i = 0; i < searchableFields.length; i++){
        if(jsonCandidate[searchableFields[i]].includes(searchTerm))
            return true;
    }
    return false;
}

function selectRelatedItems(crudeOutput, searchTerm){
    let filteredOutput = [];
    for(let i = 0; i < crudeOutput.length; i++){
        if(isRelated(searchTerm, crudeOutput[i])){
            filteredOutput.push(crudeOutput[i]);
        }
    }
    return filteredOutput;
}

function appendRetas(responseJSON, retasList, privileges){
    $("#listOfRetas").empty();
    $("#listMyRetas").empty();
    itemsId = [];
    let i = 0, cont = 0, j = numberOfCols;
    while(i < responseJSON.length){
        retasList.append(`<div class="card-deck justify-content-around" id="card-deck-${cont}"></div>`);
        while(i < responseJSON.length && i < j){
            itemsId.push(responseJSON[i]._id);
            $("#card-deck-" + cont).append(`  
                    <div class="card mb-4" style="min-width: 15rem; max-width: 15rem;">
                        <img class="card-img-top" src="${responseJSON[i].imageURL}" alt="Reta image">
                        <div class="card-body">
                            <h5 class="card-title">${responseJSON[i].name}</h5>
                            <p class="card-text">${responseJSON[i].typeOfSports}</p>
                            <p class="card-text">${responseJSON[i].cost}</p>    
                        </div>
                        <div class="card-footer" id="card-footer-${i}">
                            <small class="text-muted">${responseJSON[i].city}</small>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="sw-${i}">
                                <label class="custom-control-label" for="sw-${i}">Currently Active</label>
                            </div>
                        </div>
                    </div>`    
            );
            $("#sw-" + i).prop('checked', responseJSON[i].nowPlaying);
            if(privileges){
                $("#card-footer-" + i).append(`<button id="deleteBtn-${i}" class="btnDelete" type="button" class="btn btn-fmr">
                                                    <span id="deleteIcon-${i}" class="fa fa-trash"></span>
                                               </button>
                                               <button id="editBtn-${i}" class="btnEdit" type="button" class="btn btn-fmr">
                                                    <span id="editIcon-${i}" class="fa fa-edit"></span>
                                               </button>`);
            }
            i++;
        }
        j += numberOfCols;
        cont++;
    }
}

function selectFieldsToUpdate(){
    if(index == -1){
        return;
    }
    let field, value;
    for(let i = 0; i < updatableFields.length; i++){
        if(myNewReta[updatableFields[i]]){
            field = updatableFields[i];
            value = myNewReta[updatableFields[i]];
            console.log(field);
            updateReta(index, {field : value});
        }
    }
}

function clickListeners(){

    $("#btnSearch").on("click", function(e){
        e.preventDefault();
        let searchTerm = $("#searchInput").val();
        getAllRetas(searchTerm);
        hideSections();
        $(".allRetasSection").show();
        console.log("Searching for " + searchTerm);
    });

    $("#filterCurrentlyActive").on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".allRetasSection").show();
        getFilteredRetas("currentlyActive");
    });

    $("#filterMyCity").on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".allRetasSection").show();
        getFilteredRetas("byCity/" + currentUser.city);
    });

    $("#listOfRetas").on("click", ".card-img-top", function(e){
        e.preventDefault();
        hideSections();
        $(".detailsSection").show();
    });

    $("#listMyRetas").on("click", ".card-img-top", function(e){
        e.preventDefault();
        hideSections();
        $(".detailsSection").show();
    });

    $("#listMyRetas").on("click", ".btnDelete", function(e){
        e.preventDefault();
        index = (e.target.id).substr(11);
        if(index >= 0){
            deleteReta(itemsId[index]);
        }
    });

    $("#listMyRetas").on("click", ".btnEdit", function(e){
        e.preventDefault();
        index = (e.target.id).substr(9);
        hideSections();
        $(".addRetaSection").show();
        $("#btnUpdateReta").show();
        $("#btnAddReta").hide();
    });

    $("#btnLogin").on("click", function(e){
        e.preventDefault();
        let potentialUsername = $("#usernameInput").val();
        let potentialPassword = $("#passwordInput").val();
        getUser(potentialUsername, potentialPassword);
    });

    $('#linkAllRetas').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".allRetasSection").show();
        getAllRetas(null);
        console.log("These are all the retas");;
    });

    $('#linkMyRetas').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".myRetasSection").show();
        getMyRetas();
        console.log("These are my retas");
    });

    $('#linkAddReta').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".addRetaSection").show();
        $("#btnUpdateReta").hide();
        $("#btnAddReta").show();
        console.log("Add Reta Section");
    });

    $("#btnAddReta").on("click", function(e){
        e.preventDefault();
        getInputValues();
        postNewReta();
    });

    $("#btnUpdateReta").on("click", function(e){
        e.preventDefault();
        getInputValues();
        selectFieldsToUpdate();
    });
}


function init(){
    initAutocomplete();
    clickListeners();
    $(".homeSection").hide();
    $(".loginSection").show();
}

function getAllRetas(isFilteredOutput){
    $.ajax({
        url:(url + "/allRetas"), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting all retas");
            if(isFilteredOutput){
                appendRetas(selectRelatedItems(responseJSON, isFilteredOutput), $("#listOfRetas"), false);
            }
            else{
                appendRetas(responseJSON, $("#listOfRetas"), false);
            }
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getMyRetas(){
    $.ajax({
        url:(url + "/myRetas/" + myNewReta.username), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting my retas size = " + responseJSON.length );
            appendRetas(responseJSON, $("#listMyRetas"), true)
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getFilteredRetas(filter){
    $.ajax({
        url:(url + "/allRetas/" + filter), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting retas by city = " + responseJSON.length );
            appendRetas(responseJSON, $("#listOfRetas"), false);
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getUser(username, password){
    $.ajax({
        url:(url + '/retasLogin/' + username + "/" + password), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log(responseJSON);
            if(!responseJSON){
                console.log("User was not found")
            }
            else{
                console.log("Login success");
                myNewReta.username = currentUser.username = responseJSON.username;
                currentUser.city = responseJSON.city;
                hideSections();
                $(".homeSection").show();
                $(".allRetasSection").show();
                getAllRetas(null);
            }
            clearFields();

        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function postNewReta(){
    console.log("Posting new reta this is what I am gonna post : ")
    console.log(myNewReta);
    $.ajax({
        url:(url + "/postPlace"), //url/endpointToAPI,
        type: "POST", 
        data: JSON.stringify(myNewReta),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            console.log("Success posting new reta");
            hideSections();
            $(".allRetasSection").show();
            getAllRetas(null);
            clearFields();
            clearMyNewReta();
        },
        error : function(err){
            console.log(err);
        }
    });
}

function deleteReta(tempId){
    console.log("deleting = " + tempId);
    $.ajax({
        url:(url + '/deleteReta/' + tempId), //url/endpointToAPI,
        type: "DELETE",
        success : function(res){
            console.log('success on deleting');
            getMyRetas();
        },
        error : function(err){
            console.log('error on deleting');
        }
    });
}

function updateReta(tempId, fieldToUpd){
    console.log("Updating reta with id = " + tempId);
    $.ajax({
        url:(url + '/updateReta/' + tempId), //url/endpointToAPI,
        type: "PUT", 
        data: JSON.stringify(fieldToUpd),
        contentType: "application/json; charset=utf-8",
        success : function(response){
            clearFields();
            clearMyNewReta();
            getMyRetas();
        }
    });
}

init();