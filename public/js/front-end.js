// TODO edit and delete own retas
// Comments
// Filter by city and currently active

// base url
let url = 'https://vast-forest-34191.herokuapp.com/api';

// attributes for a new reta place
let imageURL;
let typeOfSports;
let cost;
let requisites;
let nowPlaying;
let address;
let currentUser;

// image downsize parameters
let WIDTH = 200;
let HEIGHT = 150;
let encoderOptions = 0.8;

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
        image.src = reader.result; 
        image.onload = function(){
            imageURL = downscaleImage(image);
        }
    }
    reader.readAsDataURL(file);
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("locationInput"), {types: ['geocode', 'address', 'establishment']});
  
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
    // console.log("Final address = " + address);
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
    $(".addPlaceSection").hide();
    $(".addEventSection").hide();
    $(".loginSection").hide();
    $(".allRetasSection").hide();
    $(".myRetasSection").hide();
}

function clearFields(){
    $("#locationInput").val('');
    $("#typeOfSportsInput").val('');
    $("#costInput").val('');
    $("#requisitesInput").val('');
    $("#imageInput").val('');
    $("#nowPlayingInput").val('');
}

function getInputValues(){
    address = $("#locationInput").val();
    typeOfSports =  $("#typeOfSportsInput").val();
    cost = $("#costInput").val();
    requisites = $("#requisitesInput").val();
    nowPlaying = $("#nowPlayingInput").val();
}

function addPlaceCL(){
    $("#btnAddPlace").on("click", function(e){
        e.preventDefault();
        getInputValues();
        newPlace = {
            address,
            typeOfSports,
            cost,
            requisites,
            imageURL,
            nowPlaying,
            currentUser
        };
        postNewPlace(newPlace);
    });
}

function loginCL(){
    $("#btnLogin").on("click", function(e){
        e.preventDefault();
        let potentialUsername = $("#usernameInput").val();
        let potentialPassword = $("#passwordInput").val();
        getUser(potentialUsername, potentialPassword);
    });
}

function loadAllCL(){
    $("#btnLoadAll").on("click", function(e){
        e.preventDefault();
        console.log("Load All");
        getAllRetas();
    });
}

function homeCL(){
    $('#linkAllRetas').on("click", function(e){
        e.preventDefault();
        console.log("Load All");
        getAllRetas();
    });
}

function addNewRetaCL(){
    $('#linkAddReta').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".addPlaceSection").show();
        console.log("Add Reta");
    });
}

function showMyRetasCL(){
    $('#linkMyRetas').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".myRetasSection").show();
        getMyRetas();
        console.log("These are my retas");
    });
}

function showAllRetasCL(){
    $('#linkAllRetas').on("click", function(e){
        e.preventDefault();
        hideSections();
        $(".allRetasSection").show();
        getAllRetas();
        console.log("These are my retas");
    });
}

function init(){
    initAutocomplete();
    addPlaceCL();
    addNewRetaCL();
    loadAllCL();
    loginCL();
    showMyRetasCL();
    showAllRetasCL();
    $(".homeSection").hide();
    $(".loginSection").show();
}

function getAllRetas(){
    $.ajax({
        url:(url + "/allRetas"), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting all retas");
            $("#listOfRetas").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $("#listOfRetas").append(`<li>  <p>location = ${responseJSON[i].location}</p>
                                                <p>sports = ${responseJSON[i].typeOfSports}</p>
                                                <p>cost = ${responseJSON[i].cost}</p>
                                                <p>requisites = ${responseJSON[i].requisites}</p>
                                                <p>nowPlaying = ${responseJSON[i].nowPlaying}</p>
                                                <img src= "${responseJSON[i].imageURL}">
                                          </li>`);
            }
            clearFields();
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getMyRetas(){
    $.ajax({
        url:(url + "/myRetas/" + currentUser), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting my retas size = " + responseJSON.length );
            $("#listMyRetas").empty();
            for(let i = 0; i < responseJSON.length; i++){
                console.log(responseJSON[i]);
                $("#listMyRetas").append(`<li>  <p>location = ${responseJSON[i].location}</p>
                                                <p>sports = ${responseJSON[i].typeOfSports}</p>
                                                <p>cost = ${responseJSON[i].cost}</p>
                                                <p>requisites = ${responseJSON[i].requisites}</p>
                                                <p>nowPlaying = ${responseJSON[i].nowPlaying}</p>
                                                <img src= "${responseJSON[i].imageURL}">
                                          </li>`);
            }
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
                currentUser = responseJSON.username;
                hideSections();
                $(".homeSection").show();
                $(".allRetasSection").show();
                getAllRetas();
            }
            clearFields();

        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function postNewPlace(newPlace){
    console.log(newPlace);
    $.ajax({
        url:(url + "/postPlace"), //url/endpointToAPI,
        type: "POST", 
        data: JSON.stringify(newPlace),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            console.log("Success posting new place")
            getAllRetas();
        },
        error : function(err){
            console.log(err);
        }
    });
}

// function deleteById(tempId){
//     console.log(tempId);
//     $.ajax({
//         url:(url + '/blog-posts/' + tempId), //url/endpointToAPI,
//         type: "DELETE",
//         success : function(res){
//             console.log('success on deleting');
//             getAllBlogs();
//         },
//         error : function(err){
//             console.log('error on deleting');
//         }
//     });
// }

// function updateById(tempId, updBlog){
//     console.log(tempId);
//     console.log(updBlog);
//     $.ajax({
//         url:(url + '/blog-posts/' + tempId), //url/endpointToAPI,
//         type: "PUT", 
//         data: JSON.stringify(updBlog),
//         contentType: "application/json; charset=utf-8",
//         success : function(response){
//             getAllBlogs();
//         }
//     });
// }

init();