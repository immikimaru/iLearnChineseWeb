 
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

    console.log("Add learned Hanzi with id:"+ hid + " to user:" + uid);
    db.collection('fbs', function(err, collection) {
	collection.findOne( { learned: { $in: [hid] } }, function(err,item ){
	    if (item != null)
		console.log("Already Learned !")
	    else {
		collection.update({'_id':new BSON.ObjectID(uid)}, {$push:{learned: hid}}, function(err, result) {
		    console.log(result);
		});
		console.log(item);
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
    console.log(level);
    db.collection('hanzi', function(err, collection) {
        collection.find({level:level}).toArray(function(err, items) {
	    console.log(items);
            return res.send(items);
        });
    });
};

exports.randomOne = function(req, res) {
    console.log('Random');
    db.collection('hanzi', function(err, collection) {
	collection.find().limit(-1).skip(1556415646546).next().toArray(function(err, items) {
        // collection.find().toArray(function(err, items) {
            res.send(items);
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
// You'd typically not find this code in a real-life app, since the database would already exist.
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