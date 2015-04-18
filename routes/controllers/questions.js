var Firebase = require('firebase');
var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com');
var questionsRef = rootRef.child('questions');


exports.all = function(req, res) {
  questionsRef.once('value', function(snap) {
    if(snap) {
      res.json(snap.val());
    } else {
      res.status('400').send('error occured');
    }
  });
};

exports.one = function(req, res) {
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
