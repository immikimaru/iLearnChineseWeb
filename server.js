var express = require('express');
var engine = require('ejs').__express;
var app = express();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var hanzi  = require('./modules/hanzi');
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
app.configure(function () {
    app.set('port', process.env.PORT || 8088);
    app.set('views', __dirname+'/views');
    app.engine('ejs', engine);
    app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
    app.use( express.cookieParser() );
    app.use(express.session({ secret: 'im your besta' }));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use('/public', express.static(__dirname + '/public'));
    app.use(passport.initialize());
    app.use(passport.session());
});

mongoose.connect('mongodb://localhost/hanzidb', function(err) {
    if (err) { throw err; }
})


var FacebookUserSchema = new mongoose.Schema({
    fbId: String,
    email: { type : String , lowercase : true},
    name : String,
    learned : [{ 
	id: { type: [String] }
    }]
});
var FbUsers = mongoose.model('fbs',FacebookUserSchema);

db = new Db('hanzidb', new Server("127.0.0.1", 27017, {auto_reconnect: true}), {safe: true});
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ILC' database");
        db.collection('hanzi', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'hanzi' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
	    else{
		passport.serializeUser(function(user, done) {
		    done(null, user);
		});

		passport.deserializeUser(function(obj, done) {
		    done(null, obj);
		});
		
		passport.use(new FacebookStrategy({
		    clientID: "593836007363691",
		    clientSecret: "61a9d5e52c9384310e0a959e8f86cd43",
		    callbackURL: "http://ilc.spik.it/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {

		    db.collection('fbs', function(err, collection) {
			collection.findOne({fbId : profile.id}, function(err, oldUser) {
			    if(oldUser){
				console.log("OK");
				console.log(oldUser);
				done(null,oldUser);
                            }else{
				console.log("OTHER");
				var newUser = new FbUsers({
                                    fbId : profile.id ,
                                    email : profile.emails[0].value,
                                    name : profile.displayName
				}).save(function(err,newUser){
                                    if(err) throw err;
                                    done(null, newUser);
				});
                            }
			});

		    });
		}
		));

		app.get('/hanzi', hanzi.findAll);
		app.get('/hanzi/level/:level', hanzi.findByLevel);
		app.get('/hanzi/:id', hanzi.findById);
		app.post('/hanzi', hanzi.addHanzi);
		app.put('/hanzi/:id', hanzi.updateHanzi);
		app.delete('/hanzi/:id', hanzi.deleteHanzi);

		app.get('/auth/facebook', passport.authenticate('facebook',{ scope : "email"}));
		app.get('/auth/facebook/callback', 
			passport.authenticate('facebook', { successRedirect: '/',
							    failureRedirect: '/login' }));
		
		app.post('/api/:userid/addLearned/:hid',ensureAuthenticated, hanzi.addHanziToUser);

		app.get('/', function(req, res){

                    // Premier rendu.
		    if (typeof req.user === "undefined"){
		
			res.render('view.ejs',{uid:"0"},function(err, html){

                        var data = {
                            title: 'I learn Chinese',
                            body: html,
			    fbId:"0",
			    fname:""
                        };

                        // Second rendu.
                        res.render('layout.ejs', data);
                    });

		    }
		    else
		    {
			
			res.render('view.ejs',{uid:req.user._id}, function(err, html){

                            var data = {
				title: 'I learn Chinese',
				body: html,
				fbId:req.user.fbId,
				fname:req.user.name
                            };

                        // Second rendu.
                            res.render('layout.ejs', data);
			});

		    }
                });


		app.get('/flashcards',ensureAuthenticated, function(req, res){
		    getUser(db,req,res,function(user){
			console.log("callback user");
			console.log(user);
		

			// Premier rendu.
			res.render('flashcards.ejs',{user:user}, function(err, html){

                            var data = {
                                title: 'ILC - Flashcards',
                                body: html,
                                fbId:req.user.fbId,
                                fname:req.user.name
                            };


                        // Second rendu.
                        res.render('layout.ejs', data);
			});
		    });
                });

		app.get('/addHanzi',ensureAuthenticated, function(req, res){

                    // Premier rendu.
                    res.render('addHanzi.ejs', function(err, html){

                        var data = {
                            title: 'ILC - Flashcards',
                            body: html,
                            fbId:req.user.fbId,
                            fname:req.user.name
                        };


                        // Second rendu.
                        res.render('layout.ejs', data);
                    });
                });

		app.get('/logout', function(req, res){
		    req.logout();
		    res.redirect('/');
		});

	    }
        });
    }
});
  
app.listen(8088);
console.log('Listening on port '+ app.get('port'));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

function getUser(db, req,res, callback){
    console.log("req: " + req);
    db.collection('fbs', function(err, collection) {
        collection.findOne({fbId : req.user.fbId}, function(err, oldUser) {
            if(oldUser){
                console.log(oldUser);
                res.locals.user = oldUser;
                callback(oldUser);
            }
        });

    });
};
