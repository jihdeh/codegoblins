var Firebase = require('firebase');
var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com');
var usersRef = rootRef.child('users');

// GET users listing. 
exports.all = function(req, res) {
  usersRef.once('value', function(snap) {
    if (snap) {
      res.json(snap.val());
    } else {
      res.status('400').send('error occured');
    }
  });
};

// GET one user
exports.one = function(req, res) {
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
