//
// ILC Server.js v.0.0.1
//

var express = require('express')
, engine = require('ejs').__express
, config = require('./config/env.json')
, flashcardscat = require('./config/flashcards-cat.json')
, app = express()
, mongo = require('mongodb')
, mongoose = require('mongoose')
, session = require('express-session')
, passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy
, RedisStore = require('connect-redis')(session)
, hanzi  = require('./modules/hanzi')
, data = require('./config/database.js')(mongoose)
, colors = require('colors');

Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

app.configure(function () {
    app.set('port', process.env.PORT || 8088);
    app.set( 'views', __dirname+'/views');
    app.engine( 'ejs', engine );
    app.use( express.favicon(__dirname + '/public/img/favicon.ico') );
    app.use( express.cookieParser() );
    app.use(express.session({
	key:config.session.key,
	secret: config.session.secret,
	store: new RedisStore({
            host: 'localhost',
            port: 6379,
	}),
	cookie: {maxAge:604800},
    }));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use('/public', express.static(__dirname + '/public'));
    app.use(passport.initialize());
    app.use(passport.session());
});

db = new Db('hanzidb', new Server("127.0.0.1", 27017, {auto_reconnect: true}), {safe: true});
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ILC' database".cyan);
        db.collection('hanzi', {strict:true}, function(err, collection) {
            if (collection == null) {
                console.log("The 'hanzi' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
	    else{
		require('./config/passport')(passport,mongoose,config);		
	    }
        });
    }
});

require('./config/routes.js')(app, passport,hanzi,flashcardscat);   
app.listen(8088);
console.log('Listening on port '.grey + app.get('port'));
console.log('App launched'.green.bold);