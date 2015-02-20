'use strict';
angular.module('codegoblins.service', []);
angular.module('codegoblins.controller', []);
angular.module('CodeGoblins', [
  'ui.router', 
  'firebase',
  'codegoblins.controller',
  'codegoblins.service'
])
.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("home");
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
      .state('home', {
        url: '/',
        templateUrl: 'views/partials/index.client.view.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/partials/about.html'
      })
      .state('profile', {
        controllerProvider: 'HomeCtrl',
        url: '/profile',
        templateUrl: 'views/users/profile.client.view.html',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
});


angular.module('codegoblins.controller')
    .controller('HomeCtrl', ['$scope', 'Auth', 'insertUserData', '$location', '$timeout', '$firebase', function($scope, Auth, insertUserData, $location, $timeout, $firebase) {
        $scope.auth = Auth;
        $scope.insertData = insertUserData;

        $scope.login = function() {
            $scope.auth.$authWithOAuthPopup('google').then(function(authData) {
                console.log('Logged in as:', authData.uid);
                $timeout(function() {
                    $location.path('/profile');
                });
                Auth.$onAuth(function(authData) {
                    $scope.authData = authData;
                });
                $scope.user = $scope.auth.$getAuth(); //change user status.
                console.log($scope.user);
                //send data to database
                $scope.insertData.$add({
                    userProviderId: $scope.user.google.id,
                    username: $scope.user.google.displayName
                }).then(function(ref) {
                    var id = ref.key();
                    console.log('added record with id ' + id);
                });
            }).catch(function(error) {
                console.error('Authentication failed:', error);
            });
        };

        $scope.logout = function() {
            $scope.auth.$unauth();
            $scope.auth.$onAuth(function(authData) {
                if (!authData) {
                    console.log('Logged out');
                    $timeout(function() {
                        $location.path('/about');
                    });
                    $scope.user = $scope.auth.$getAuth(); //change user status to logged out
                } //end if
            }); //end listening state
        };

    }]);

angular.module('codegoblins.controller')
.controller('profileCtrl', ['$scope', 'insertUserData', function($scope, insertUserData){

	$scope.user = $scope.auth.$getAuth();
	console.log('profile is in control');

	$scope.editprofile = function() {
		console.log('function is fired');
	}

}]);
// .factory('insertUserData', ['$firebase', function($firebase) {
// 		ref = ref.child('users');
// 		return $firebase(ref).$asArray();
// 	}])

// 	.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
// 	  return $firebaseAuth(ref);
// 	}]);

    var rootRef = new Firebase('https://crackling-fire-1666.firebaseio.com/');
angular.module('codegoblins.service')

 .factory('Refs', ['$firebase', function($firebase) {

    return {
      rootRef: rootRef,
      testUserRef: rootRef.child('testUsers'),
      usersRef: rootRef.child('users'),
      expertUserRef: rootRef.child('experts')
    };
  }])

	.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
	  return $firebaseAuth(rootRef);
	}]);


 angular.module('codegoblins.service')

 .factory('insertUserData', ['Refs', '$firebase', function(Refs, $firebase) {
		var ref = Refs.rootRef.usersRef;
		return $firebase(ref).$asArray();
		console.log(Refs.rootRef.usersRef);
	}]);