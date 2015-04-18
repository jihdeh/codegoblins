'use strict';

var express = require('express');
var router = express.Router();
var users = require('./controllers/user.js');
var questions = require('./controllers/questions.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

var routes = ['/login', '/profile', '/browse', '/profile/*', '/about', 
                '/questions', '/new', '/question/*', '/edit/question/*']

router.get(routes, function(req, res) {
	res.render('index');
});


router.get('/api/v1/users', users.all);
router.get('/api/v1/users/:id', users.one);
router.get('/api/v1/questions', questions.all);
router.get('/api/v1/questions/:id', questions.one);

module.exports = router;
