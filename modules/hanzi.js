function isLearned(idHanzi, idUser,callback) {
    console.log('Checking if hanzi: ' + idHanzi + " is learned by " + idUser);
    db.collection('fbs', function(err, collection) {
        collection.find( {_id:new BSON.ObjectID(idUser),learned:idHanzi.toString()}).toArray(function(err,item ){
            if (err)
                console.log(err);
            if (item.length > 0)
                callback(true);
            else
                callback(false);
        });
    });
};
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving hanzi: ' + id);
    db.collection('hanzi', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.addHanziToUser = function(req, res) {
    var uid = req.params.userid;
    var hid = req.params.hid;

    console.log("Requesting learning Hanzi with id:"+ hid + "for user:" + uid);
    db.collection('fbs', function(err, collection) {
	if (err)
	    console.log(err);
	isLearned(hid,uid,function(ret){
	    if (!ret){
		collection.update({'_id':new BSON.ObjectID(uid)}, {$push:{learned: hid}}, function(err, result) {
		    if (err)
			throw err;
		    console.log("User "+ uid +" just learned " + hid);
		    res.send(result);
		});
	    }
	    else{
		console.log(hid + "Already learned by " + uid);
		res.send(null);
	    }
	});
    });
};

exports.removeHanziToUser = function(req, res) {
    var uid = req.params.userid;
    var hid = req.params.hid;

    console.log("Requesting remove learning Hanzi with id:"+ hid + "for user:" + uid);
    db.collection('fbs', function(err, collection) {
        if (err)
            console.log(err);
        isLearned(hid,uid,function(ret){
	    console.log(ret);
            if (ret){
                collection.update({'_id':new BSON.ObjectID(uid)}, {$pull:{learned: hid}}, function(err, result) {
                    if (err)
                        throw err;
                    console.log("User "+ uid +" just removed learned " + hid);
                    res.send(result);
                });
            }
            else{
                console.log(hid + "Not learned by " + uid);
                res.send(null);
            }
        });
    });
};

 
exports.findAll = function(req, res) {
    db.collection('hanzi', function(err, collection) {
        collection.find().toArray(function(err, items) {
            return res.send(items);
        });
    });
};

exports.findByLevel = function(req, res) {
    var level = req.params.level;
    db.collection('hanzi', function(err, collection) {
        collection.find({level:level}).toArray(function(err, items) {
	    console.log(items);
            return res.send(items);
        });
    });
};

exports.randomOne = function(req, res) {
    var level = req.params.level;
    db.collection('hanzi', function(err, collection) {
	collection.find({level:level}).count(function(err, count) {
	    var nb = Math.floor(Math.random()*(count));
            collection.find({level:level}).limit(-1).skip(nb).next(function(err, item) {
		isLearned(item._id,req.params.userid,function(ret){
		    if (ret)
			item.isLearned = true;
		    res.send(item);
		});
            });
        });
    });
};
 
exports.addHanzi = function(req, res) {
    var hanzi = req.body;
    console.log('Adding hanzi: ' + JSON.stringify(hanzi));
    db.collection('hanzi', function(err, collection) {
        collection.insert(hanzi, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateHanzi = function(req, res) {
    var id = req.params.id;
    var hanzi = req.body;
    console.log('Updating hanzi: ' + id);
    console.log(JSON.stringify(hanzi));
    db.collection('hanzi', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, hanzi, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating hanzi: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(hanzi);
            }
        });
    });
}
 
exports.deleteHanzi = function(req, res) {
    var id = req.params.id;
    console.log('Deleting hanzi: ' + id);
    db.collection('hanzi', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
var populateDB = function() {
 
    var hanzi = [
	{
            chs: "爱",
            cht: "愛",
            pinyin: "Ài",
            translation_fr: "Amour",
            translation_en: "Love",
	    level: 1,
            keys: [1,5,6]
	},
	{
	    chs: "熬",
            cht: "熬",	
            pinyin: "ao",
            translation_fr: "Faire bouillir",
            translation_en: "Decoct",
            level: 3,
            keys: [2,5,8]
	}];
 
    db.collection('hanzi', function(err, collection) {
        collection.insert(hanzi, {safe:true}, function(err, result) {});
    });
 
};