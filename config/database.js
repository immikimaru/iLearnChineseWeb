module.exports = function(mongoose) {

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
};