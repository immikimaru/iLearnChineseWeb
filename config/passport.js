var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport,mongoose,config) {

    var FbUsers = mongoose.model('fbs');
    
    passport.serializeUser(function(user, done) {
        console.log("serialize user");
        done(null, user._id);
    });

    passport.deserializeUser(function(obj, done) {
        console.log("deserialize user");
        db.collection('fbs', function(err, collection) {
	    if (err)
		console.log('ERROR' + err);
            collection.findOne({'_id' : new BSON.ObjectID(obj)}, function(err, oldUser) {
                done(err, oldUser);
            });
        });
    });

    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
    },
				      function(accessToken, refreshToken, profile, done) {
					  db.collection('fbs', function(err, collection) {
					      collection.findOne({fbId : profile.id}, function(err, oldUser) {
						  if(oldUser){
						      console.log(oldUser);
						      done(null,oldUser);
						  }else{
						      console.log("NEW USER");
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
}