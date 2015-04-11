'use strict';

var express = require('express');
var router = express.Router();
var users = require('./controllers/user.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

var routes = ['/login', '/trends', '/updates', '/profile', '/browse', '/profile/*', '/about', 
                '/questions', '/new', '/question/*']

router.get(routes, function(req, res) {
	res.render('index');
});


router.get('/users', users.getUsers);
router.get('/users/:id', users.getOneUser);
router.get('/all/questions', users.getQuestions);
router.get('/questions/:id', users.getOneQuestion);

module.exports = router;
