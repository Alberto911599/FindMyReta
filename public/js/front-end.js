// let url = 'https://fierce-mountain-90125.herokuapp.com/api';

function clearFields(){
    $("#locationInput").val('');
    $("#typeOfSportsInput").val('');
    $("#costInput").val('');
    $("#imageInput").val('');
    $("#nowPlayingInput").val('');
}

function init(){
    console.log("initialized")
    // getAllBlogs();
    $("#btnAddPlace").on("click", function(e){
        e.preventDefault();
        console.log("add place");
        // newPost = {
        //     title : $("#tileInput").val(),
        //     author :  $("#authorInput").val(),
        //     content : $("#contentInput").val(),
        //     publishDate : $("#publishDateInput").val(),
        //     id : $("#idInput").val()
        // };
        // postNewBlog(newPost);
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

// function getAllBlogs(){
//     $.ajax({
//         url:(url + "/blog-posts"), //url/endpointToAPI,
//         method: "GET", 
//         data: {}, //Info sent to the API
//         dataType : "json", //Returned type od the response
//         ContentType : "application/json", //Type of sent data in the request (optional)
//         success : function(responseJSON){
//             console.log("success");
//             $(".listOfBlogs").empty();
//             for(let i = 0; i < responseJSON.length; i++){
//                 $(".listOfBlogs").append(`<li>  <p>id = ${responseJSON[i].id}</p>
//                                                 <p>author = ${responseJSON[i].author}</p>
//                                                 <p>title = ${responseJSON[i].title}</p>
//                                                 <p>content = ${responseJSON[i].content}</p> 
//                                                 <p>publishingDate = ${responseJSON[i].publishDate}</p>
//                                           </li>`);
//             }
//             clearFields();
//         }, 
//         error: function(err){
//             console.log("error");
//         }
//     });
// }

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

// function postNewBlog(newBlog){
//     console.log(newBlog);
//     $.ajax({
//         url:(url + "/addPost"), //url/endpointToAPI,
//         type: "POST", 
//         data: JSON.stringify(newBlog),
//         contentType: "application/json; charset=utf-8",
//         success : function(result){
//             getAllBlogs();
//         },
//         error : function(err){
//             console.log(err);
//             console.log("error");
//         }
//     });
// }

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