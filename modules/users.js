function searchCount1(user,rArray,callback){
    db.collection('fbs', function(err, collection) {
        collection.find({'_id':new BSON.ObjectID(user),learned:rArray}).toArray(function(err, it) {
            if (it.length)
		callback(true);
	    else
		callback(false);
        });
    });
}

function searchCount(req,res,callback){
    var user = req.params.userid;
    var lid = req.params.level;
    var c = 0;
    db.collection('hanzi', function(err, collection) {
        collection.find({level:lid}).toArray(function(err, items) {

            var countResponse = {};
            var rArray ;
	    var i = 0;

            while(i < items.length){
                rArray = items[i]._id.toString();
		console.log(rArray);
		searchCount1(user,rArray,function(r){
		    if (r){
			console.log(c);
			c++;
		    }
		    if (i == items.length)
			callback(c);
		});    
		i++;
            }
        });
    });
}


exports.findAll = function(req, res) {
    db.collection('fbs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.userCountByLevel = function(req, res) {
    searchCount(req,res,function(r){
	console.log("COUNT" + r);
    });
};

