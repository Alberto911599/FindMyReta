let express = require ('express');
let morgan = require ('morgan');
let bodyParser = require( "body-parser" );
let mongoose = require('mongoose');
let app = express();
let jsonParser = bodyParser.json();
let {PlaceList, UserList} = require('./models');
let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use( morgan( 'dev' ) );
mongoose.Promise = global.Promise;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/api/allRetas', ( req, res, next ) => {
    console.log("Getting retas in Server");
	PlaceList.get()
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/myRetas/:username', ( req, res, next ) => {
    console.log("Getting my retas in Server");
    let filter = {username : req.params.username};
	PlaceList.getMyRetas(filter)
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/allRetas/byCity/:city', ( req, res, next ) => {
    console.log("Getting retas by city in server");
    let filter = {city : req.params.city};
	PlaceList.getMyRetas(filter)
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/allRetas/findById/:id', ( req, res, next ) => {
    console.log("Getting retas by id in server = ");
    let filter = req.params.id;
    if(!filter){
        return;
    }
	PlaceList.getRetaById(filter)
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/allRetas/currentlyActive', ( req, res ) => {
    console.log("Getting active retas in server");
    let filter = {nowPlaying : true};
	PlaceList.getMyRetas(filter)
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/allRetas/trending', ( req, res ) => {
    console.log("Getting trending");
	PlaceList.getTrending()
		.then( retas => {
			return res.status( 200 ).json( retas );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.post('/api/postPlace', jsonParser, (req, res) => {
    console.log("Posting new place");
    if(!req.body.name || !req.body.location || !req.body.typeOfSports || !req.body.cost){
        res.statusMessage = "Missing field in place form";
        return res.status(406).json({
           "error" : "Missing field",
           "status" : 406
        });
    }
    PlaceList.post(req.body)
        .then(place => {
            res.status(201).json(place);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong";
            return res.status(501).json({
                "error" : "Something went wrong with the data base",
                "status" : 501
            });
        });
});


app.put('/api/updateReta/:id', jsonParser, (req, res, next) => {
    let filterID = req.params.id;
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    console.log(req.body);
    PlaceList.put({ _id : filterID }, req.body)
       .then(place => {
           res.status(201).json(place);
       })
       .catch(err => {
           res.statusMessage = "Missing field in body";
           return res.status(500).json({
               "error" : "Something went wrong with the data base",
               "status" : 500
           });
       });
});

app.delete('/api/deleteReta/:id', (req, res) => {
    console.log("deleting");
    let filterID = req.params.id;
    console.log("deleting " + filterID);
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    PlaceList.delete({_id : filterID})
       .then(blog => {
           res.status(201).json(blog);
       })
       .catch(err => {
           res.statusMessage = "Missing field in body";
           return res.status(500).json({
               "error" : "Something went wrong with the data base",
               "status" : 500
           });
       });
});

app.get('/api/retasLogin/:username/:password', (req, res) => {
    let potUsername = req.params.username;
    let potPassword = req.params.password;
    if(!potUsername || !potPassword){
        res.statusMessage = "Missing username or password";
        return res.status(406).json({
           "error" : "Missing username or password",
           "status" : 406
       });
    }
    UserList.get({username : potUsername, password : potPassword})
        .then( retas => {
            return res.status( 200 ).json( retas );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.put('/api/addLikedReta/:id', jsonParser, (req, res, next) => {
    let filterID = req.params.id;
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    console.log(req.body);
    UserList.put({ _id : filterID }, req.body)
       .then(like => {
           res.status(201).json(like);
       })
       .catch(err => {
           res.statusMessage = "Missing field in body";
           return res.status(500).json({
               "error" : "Something went wrong with the data base",
               "status" : 500
           });
       });
});

app.put('/api/addAssistReta/:id', jsonParser, (req, res, next) => {
    let filterID = req.params.id;
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    console.log(req.body);
    UserList.put({ _id : filterID }, req.body)
       .then(assist => {
           res.status(201).json(assist);
       })
       .catch(err => {
           res.statusMessage = "Missing field in body";
           return res.status(500).json({
               "error" : "Something went wrong with the data base",
               "status" : 500
           });
       });
});

app.put('/api/updateState/:id', jsonParser, (req, res, next) => {
    let filterID = req.params.id;
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    console.log(req.body);
    PlaceList.put({ _id : filterID }, req.body)
       .then(state => {
           res.status(201).json(state);
       })
       .catch(err => {
           res.statusMessage = "Missing field in body";
           return res.status(500).json({
               "error" : "Something went wrong with the data base",
               "status" : 500
           });
       });
});


let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
        if ( response ){
            return reject(response);
        }
        else{
            server = app.listen(port, () => {
            console.log( "App is running on port " + port );
            resolve();
        })
            .on( 'error', err => {
                mongoose.disconnect();
                return reject(err);
            })
        }
        });
    });
}
   
function closeServer(){
    return mongoose.disconnect()
            .then(() => {
    return new Promise((resolve, reject) => {
    console.log('Closing the server');
    server.close( err => {
        if (err){
            return reject(err);
        }
        else{
            resolve();
        }});
    });
    });
   }
   
runServer( PORT, DATABASE_URL )
    .catch( err => {
    console.log( err );
});
   
module.exports = { app, runServer, closeServer };