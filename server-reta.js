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

app.post('/api/postPlace', jsonParser, (req, res) => {
    console.log("Posting new place");
    let location = req.body.address;
    let typeOfSports = req.body.typeOfSports;
    let cost = req.body.cost;
    let requisites = req.body.requisites;
    let nowPlaying = req.body.nowPlaying;
    let imageURL = req.body.imageURL;  
    let username = req.body.currentUser; 
    if(!location || !typeOfSports || !cost){
        res.statusMessage = "Missing field in place form";
        return res.status(406).json({
           "error" : "Missing field",
           "status" : 406
        });
    }
     let newPlace = {
         location,
         typeOfSports,
         cost,
         requisites,
         imageURL,
         nowPlaying,
         username
     };
     PlaceList.post(newPlace)
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


app.put('/api/updatePlace/:id', jsonParser, (req, res, next) => {
    let filterID = req.params.id;
    if(!filterID || !req.body){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    PlaceList.put({ id : filterID }, req.body)
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

app.delete('/api/deletePlace/:id', (req, res) => {
    let filterID = req.params.id;
    if(!filterID){
        res.statusMessage = "Missing field id";
        return res.status(406).json({
           "error" : "Missing id",
           "status" : 406
       });
    }
    PlaceList.delete({ id : filterID })
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
})


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