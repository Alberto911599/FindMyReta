let mongoose = require('mongoose');
mongoose.Promise = global.Promise;



let placeSchema = mongoose.Schema({
    location : {type : String},
    city : {type : String},
    name : {type : String},
    typeOfSports : {type : String},
    cost : {type : String},
    requisites : {type : String},
    nowPlaying : {type : Boolean},
    imageURL: { type : String },
    username : { type : String },
    likes : {type : Number},
    assistants : {type : Number}
});

let userSchema = mongoose.Schema({
    username : {type : String},
    password : {type : String},
    city : {type : String}
});


let Place = mongoose.model('Reta', placeSchema);

let User = mongoose.model('User', userSchema);

let UserList = {
    get : function(potUser){
        console.log("Getting User");
        return User.findOne(potUser)
                .then( user => {
                    return user;
                })
                .catch( err=> {
                    throw Error(err);   
                });
    }
}

let PlaceList = {
    get : function(){
        console.log("Place get");
		return Place.find()
				.then( places => {
					return places;
				})
				.catch( error => {
					throw Error( error );
				});
    },
    getMyRetas : function(filter){
        console.log("Getting my retas");
        return Place.find(filter)
            .then( places => {
                return places;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    post : function(newPlace){
        console.log("Place Post");
        return Place.create(newPlace)
                .then( place => {
                    return place;
                })
                .catch( err=> {
                    throw Error(err);   
                });
    },
    put : function(filer, updatedInfo){
        console.log("Place Put");
        return Place.updateOne(filer, updatedInfo)
                .then( place => {
                    return place;
                })
                .catch( err=> {
                    throw Error(err);   
                });
    },
    delete :  function(filter){
        console.log("Place Delete");
        return Place.deleteOne(filter)
            .then( place => {
                return place;
            })
            .catch( err=> {
                throw Error(err);   
            });
    }
}

module.exports = { PlaceList, UserList };