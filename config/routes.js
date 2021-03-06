module.exports = function(app, passport,hanzi,flashcardscat,menu,users) {

    //API
    app.get('/api/hanzi', ensureAuthenticated, hanzi.findAll);
    app.get('/api/:userid/level/:level', ensureAuthenticated, hanzi.randomOne);
    app.get('/hanzi/:id', ensureAuthenticated, hanzi.findById);
    app.post('/hanzi', ensureAuthenticated, hanzi.addHanzi);
    app.put('/hanzi/:id', ensureAuthenticated,hanzi.updateHanzi);
    app.delete('/hanzi/:id', ensureAuthenticated,hanzi.deleteHanzi);
    app.post('/api/:userid/addLearned/:hid',ensureAuthenticated, hanzi.addHanziToUser);
    app.post('/api/:userid/removeLearned/:hid',ensureAuthenticated, hanzi.removeHanziToUser);
    app.get('/api/users', ensureAuthenticated, users.findAll);
    app.get('/api/:userid/count/:level',ensureAuthenticated,users.userCountByLevel);

    //Facebook
    app.get('/auth/facebook', passport.authenticate('facebook',{ scope : "email"}));
    app.get('/auth/facebook/callback',
            passport.authenticate('facebook', { successRedirect: '/',
                                                failureRedirect: '/' }));
    app.get('/', function(req, res){
        if (req.isAuthenticated() == false){
            var data = {title: 'I Learn Chinese'};
            res.render('login.ejs',data);
        }
        else
        {
	    console.log(menu.Dashboard);
            var data = {
                title: 'Dashboard',
                body: '',
		fbId:req.user.fbId,
                userId:req.user._id,
                fname:req.user.name,
                load:'',
		menu:menu.Dashboard
            };
            res.render('dashboard.ejs',data);
        }
    });

    //Flashcards
    app.get('/flashcards',ensureAuthenticated, function(req, res){
        res.render('view.ejs',{uid:req.user._id,cat:flashcardscat}, function(err, html){ 
            var data = {
                title: 'Flashcards',
                body: html,
                fbId:req.user.fbId,
                userId:req.user._id,
                fname:req.user.name,
                load:'landing-flashcards.js',
		menu:menu.Flashcards
            };
            res.render('dashboard.ejs', data);
        });
    });
       
    app.get('/flashcards/level/:idLevel',ensureAuthenticated, function(req, res){
        getUser(db,req,res,function(user){
            res.render('card.ejs',{user:user, idLevel:req.params.idLevel}, function(err, html){
                var data =  {
                    bodycard: html,
                };
                res.render('flashcards.ejs',{user:user, idLevel:req.params.idLevel,bodycard:data.bodycard}, function(err, html){
		    if (err)
			console.log(err);
                    var data = {
                        title: 'Flashcards',
                        body: html,
                        userId:req.user._id,
			fbId : req.user.fbId,
                        fname:req.user.name,
                        load:'flashcards.js',
			menu:menu.Flashcards
                    };
                    res.render('dashboard.ejs', data);
                });
            });
        });
    });

    //Dictionary
    app.get('/dictionary',ensureAuthenticated, function(req, res){
        res.render('dictionary.ejs',{uid:req.user._id}, function(err, html){
            var data = {
                title: 'Dictionary',
                body: html,
                fbId:req.user.fbId,
                userId:req.user._id,
                fname:req.user.name,
                load:'dictionary.js',
		menu:menu.Dictionary
            };
            res.render('dashboard.ejs', data);
        });
    });

    //Profiles
    app.get('/users',ensureAuthenticated, function(req, res){
        res.render('users.ejs',{uid:req.user._id}, function(err, html){
            var data = {
                title: 'Users',
                body: html,
                fbId:req.user.fbId,
                userId:req.user._id,
                fname:req.user.name,
                load:'users.js',
                menu:menu.Dashboard
            };
            res.render('dashboard.ejs', data);
        });
    });


    //Add vocabulary
    app.get('/addHanzi',ensureAuthenticated, function(req, res){

        res.render('addHanzi.ejs', function(err, html){

            var data = {
                title: 'Add Vocabulary',
                body: html,
                user_id:req.user._id,
                fname:req.user.name
            };

            res.render('layout.ejs', data);
        });
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });


};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

function getUser(db, req,res, callback){
    db.collection('fbs', function(err, collection) {
        collection.findOne({fbId : req.user.fbId}, function(err, oldUser) {
            if(oldUser){
                res.locals.user = oldUser;
                callback(oldUser);
            }
        });

    });
};
