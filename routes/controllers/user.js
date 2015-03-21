var Firebase = require('firebase');
var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com/users');

// GET users listing. 
exports.getUsers = function(req, res) {
	rootRef.once('value', function(snap) {
		if(snap) {
			res.json(snap.val());
		} else {
			res.status('400').send('error occured');
		}
	});
};

// GET one user
exports.getOneUser = function(req, res) {
	var userId = req.params.id;
	console.log(userId);
	rootRef.child(userId).once('value', function(snap) {
		if(snap) {
			res.json(snap.val());
		} else {
			res.status('400').send('error occured');
		}
	});
};

