var Firebase = require('firebase');
var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com');
var usersRef = rootRef.child('users');
var questionsRef = rootRef.child('questions');

// GET users listing. 
exports.getUsers = function(req, res) {
  usersRef.once('value', function(snap) {
    if (snap) {
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
  usersRef.child(userId).once('value', function(snap) {
    if (snap) {
      res.json(snap.val());
    } else {
      res.status('400').send('error occured');
    }
  });
};

exports.getQuestions = function(req, res) {
	questionsRef.once('value', function(snap) {
		if(snap) {
			res.json(snap.val());
		} else {
			res.status('400').send('error occured');
		}
	});
};

exports.getOneQuestion = function(req, res) {
  var questionId = req.params.id;
  console.log(questionId);
  questionsRef.child(questionId).once('value', function(snap) {
    if (snap) {
      res.json(snap.val());
    } else {
      res.status('400').send('error occured');
    }
  });
};
