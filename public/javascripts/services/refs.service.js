var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com/');
angular.module('codegoblins.service')
 .factory('Refs', ['$firebase', function($firebase) {

    return {
      rootRef: rootRef,
      testUserRef: rootRef.child('testUsers'),
      usersRef: rootRef.child('users'),
      expertUserRef: rootRef.child('experts'),
      tagsRef: rootRef.child('tags'),
      questionsRef: rootRef.child('questions')
    };
    
  }])
