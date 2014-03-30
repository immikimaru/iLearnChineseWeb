var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport,mongoose) {

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
        clientID: "593836007363691",
        clientSecret: "61a9d5e52c9384310e0a959e8f86cd43",
        callbackURL: "http://ilc.spik.it/auth/facebook/callback"
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