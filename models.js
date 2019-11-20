let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let placeSchema = mongoose.Schema({
    location : {type : String},
    typeOfSports : {type : String},
    cost : {type : String},
    image : {type : String},
    requisites : {tye : String},
    nowPlaying : {type : String}
});

let Place = mongoose.model('Reta', placeSchema);

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

module.exports = { PlaceList };