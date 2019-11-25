// TODO edit and delete own retas
// Comments
// Filter by city and currently active

// base url
let url = 'https://vast-forest-34191.herokuapp.com/api';


// new place to add
let myNewReta = {
    location : "",
    city : "",
    name : "",
    typeOfSports : "",
    cost : "",
    requisites : "",
    nowPlaying : "",
    imageURL: "",
    username : "",
    likes : 0,
    assistants : 0
}

// esta variable permite llevar un control del grid
let numberOfCols = 4;

// image downsize parameters
let WIDTH = 200;
let HEIGHT = 150;
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
        image.src = reader.result; 
        image.onload = function(){
            // imageURL = downscaleImage(image);
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
}

function clearFields(){
    $("#locationInput").val('');
    $("#nameInput").val('');
    $("#typeOfSportsInput").val('');
    $("#costInput").val('');
    $("#requisitesInput").val('');
    $("#imageInput").val('');
    $("#nowPlayingInput").val('');
}

function getInputValues(){
    myNewReta.location = $("#locationInput").val();
    myNewReta.name = $("#nameInput").val();
    myNewReta.typeOfSports =  $("#typeOfSportsInput").val();
    myNewReta.cost = $("#costInput").val();
    myNewReta.requisites = $("#requisitesInput").val();
    myNewReta.nowPlaying = $("#nowPlayingInput").val();
}

function clickListeners(){

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
        getAllRetas();
        console.log("These are my retas");;
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
        console.log("Add Reta Section");
    });

    $("#btnAddReta").on("click", function(e){
        e.preventDefault();
        getInputValues();
        postNewReta();
    });
}


function init(){
    initAutocomplete();
    clickListeners();
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
            let i = 0, cont = 0, j = numberOfCols;
            while(i < responseJSON.length){
                $("#listOfRetas").append(`<div class="card-deck justify-content-around" id="card-deck-${cont}"></div>`);
                while(i < responseJSON.length && i < j){
                    $("#card-deck-" + cont).append(`  
                            <div class="card mb-4" style="min-width: 15rem; max-width: 15rem;">
                                <img class="card-img-top" src="${responseJSON[i].imageURL}" alt="Reta image">
                                <div class="card-body">
                                    <h5 class="card-title">${responseJSON[i].name}</h5>
                                    <p class="card-text">${responseJSON[i].typeOfSports}</p>
                                    <p class="card-text">${responseJSON[i].cost}</p>    
                                </div>
                                <div class="card-footer">
                                    <small class="text-muted">${responseJSON[i].city}</small>
                                    <div class="custom-control custom-radio">
                                        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                                        <label class="custom-control-label" for="customRadio1">Currently Active</label>
                                    </div>
                                </div>
                            </div>`    
                    );
                    i++;
                }
                j += numberOfCols;
                cont++;
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
        url:(url + "/myRetas/" + myNewReta.username), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            console.log("Success on getting my retas size = " + responseJSON.length );
            $("#listMyRetas").empty();
            let i = 0, cont = 0, j = numberOfCols;
            while(i < responseJSON.length){
                $("#listMyRetas").append(`<div class="card-deck justify-content-around" id="card-deck-mr-${cont}"></div>`);
                while(i < responseJSON.length && i < j){
                    $("#card-deck-mr-" + cont).append(`  
                            <div class="card mb-4" style="min-width: 15rem; max-width: 15rem;">
                                <img class="card-img-top" src="${responseJSON[i].imageURL}" alt="Reta image">
                                <div class="card-body">
                                    <h5 class="card-title">${responseJSON[i].typeOfSports}</h5>
                                    <p class="card-text">${responseJSON[i].requisites}</p>
                                </div>
                                <div class="card-footer">
                                    <small class="text-muted">${responseJSON[i].city}</small>
                                    <small class="text-muted">${responseJSON[i].nowPlaying}</small>
                                </div>
                            </div>`    
                    );
                    i++;
                }
                j += numberOfCols;
                cont++;
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
                myNewReta.username = responseJSON.username;
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
            $("allRetasSection").show();
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