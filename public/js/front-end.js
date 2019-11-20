let url = 'https://vast-forest-34191.herokuapp.com/api';

function clearFields(){
    $("#locationInput").val('');
    $("#typeOfSportsInput").val('');
    $("#costInput").val('');
    $("#requisitesInput").val('');
    $("#imageInput").val('');
    $("#nowPlayingInput").val('');
}

function init(){
    console.log("initialized")
    getAllRetas();
    $("#btnAddPlace").on("click", function(e){
        e.preventDefault();
        console.log("add place");
        newPlace = {
            location : $("#locationInput").val(),
            typeOfSports :  $("#typeOfSportsInput").val(),
            cost : $("#costInput").val(),
            requisites : $("#requisitesInput").val(),
            image :$("#imageInput").val(),
            nowPlaying : $("#nowPlayingInput").val()
        };
        postNewPlace(newPlace);
    });
    $("#btnAddEvent").on("click", function(e){
        e.preventDefault();
        console.log("add event");
        // updPost = {
        //     title : $("#tileInput").val(),
        //     content : $("#contentInput").val(),
        //     author :  $("#authorInput").val(),
        //     publishDate : $("#publishDateInput").val(),
        //     id : $("#idInput").val()
        // };
        // updateById($("#idInput").val(), updPost);
    });
    // $("#btnSearchByAuthor").on("click", function(e){
    //     e.preventDefault();
    //     getBlogsByAuthor($("#auhorSearch").val());
    // });
    // $("#btnDelete").on("click", function(e){
    //     e.preventDefault();
    //     deleteById($("#idDelete").val());
    // });
    $("#btnLoadAll").on("click", function(e){
        e.preventDefault();
        console.log("Load All");
        // getAllBlogs();
    });
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
            $(".listOfRetas").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $(".listOfRetas").append(`<li>  <p>location = ${responseJSON[i].location}</p>
                                                <p>sports = ${responseJSON[i].typeOfSports}</p>
                                                <p>cost = ${responseJSON[i].cost}</p>
                                                <p>requisites = ${responseJSON[i].requisites}</p>
                                                <p>image = ${responseJSON[i].image}</p> 
                                                <p>nowPlaying = ${responseJSON[i].nowPlaying}</p>
                                          </li>`);
            }
            clearFields();
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

// function getBlogsByAuthor(author){
//     $.ajax({
//         url:(url + '/blog-posts/' + author), //url/endpointToAPI,
//         method: "GET", 
//         data: {}, //Info sent to the API
//         dataType : "json", //Returned type od the response
//         ContentType : "application/json", //Type of sent data in the request (optional)
//         success : function(responseJSON){
//             $(".listOfBlogs").empty();
//             for(let i = 0; i < responseJSON.length; i++){
//                 $(".listOfBlogs").append(`<li>   <p>id = ${responseJSON[i].id}</p>
//                                                     <p>author = ${responseJSON[i].author}</p>
//                                                     <p>title = ${responseJSON[i].title}</p>
//                                                     <p>content = ${responseJSON[i].content}</p> 
//                                                     <p>publishingDate = ${responseJSON[i].publishDate}</p>
//                                         </li>`);
//             }
//             clearFields();

//         }, 
//         error: function(err){
//             console.log("error");
//         }
//     });
// }

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