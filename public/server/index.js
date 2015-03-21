'use strict';
angular.module('codegoblins.service', []);
angular.module('codegoblins.controller', []);
angular.module('CodeGoblins', [
        'ui.router',
        'ngAnimate',
        'toastr',
        'firebase',
        'mentio',
        'codegoblins.controller',
        'codegoblins.service'
    ])
.run(["$rootScope", "$state", 'Refs', function($rootScope, $state, Refs) {
  $rootScope._ = window._;
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, error) {
    // and redirect the user back to the home page
      // var states = (toState.name !== 'signup' && toState.name !== 'login' && toState.name !== 'reset-password' && toState.name !== 'error_404');
      //  console.log('ahahahha');
      //  if(states) {
      //   console.log(states);
      //   event.preventDefault();
      //   $state.go('error_404');
      //  }
      //  else {
      //   console.log('deeper');
      //  }
  });
}])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
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
                    templateUrl: 'views/users/profile.client.view.html'
                })
                .state('browse', {
                    url: '/browse',
                    templateUrl: 'views/users/browse.client.view.html'
                })
                .state('users', {
                  url: '/browse/:id',
                  templateUrl: 'views/users/userbrowse.client.view.html',
                  controller: function($scope, $stateParams) {

                  }
                })
                .state('error_404', {
                    url: '/error_404',
                    templateUrl: 'views/error.html'
                });
        }]);


angular.module('codegoblins.controller')
  .controller('browse', ['$scope', '$http', '$rootScope', 'Refs', 'Profiles', '$timeout', 'Users', function($scope, $http, $rootScope, Refs, Profiles, $timeout, Users) {

    console.log($rootScope.user);
    Users.findAll().then(function(response) {
      $scope.users = response.data;
    }, function(error) {
      return 'Error Occured';
    });

    Users.findOne().then(function(response) {
      $scope.userDetails = response.data;
    },function(error) {
      return 'No data returned';
    });

  }]);

angular.module('codegoblins.controller')
  .controller('HomeCtrl', ['$scope', '$location', '$timeout', 'Refs', '$rootScope', function($scope, $location, $timeout, Refs, $rootScope) {
    $rootScope.user = Refs.rootRef.getAuth();
    $scope.login = function() {
        Refs.rootRef.authWithOAuthPopup('google', function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                Refs.usersRef.child(authData.uid).update({
                    provider: authData.provider,
                    name: authData.google.displayName,
                    uid: authData.uid,
                    avatar: authData.google.cachedUserProfile.picture
                });
                $timeout(function() {
                    $location.path('/profile');
                    $rootScope.user = Refs.rootRef.getAuth();
                    console.log(authData);

                });
            }
        }, {
            remember: "sessionOnly"
        });

    };

    $scope.logout = function() {
        Refs.rootRef.unauth();
        $rootScope.user = Refs.rootRef.getAuth(); //change user status to logged out
        $timeout(function() {
            $location.path('/about');
        });
    };

  }]);

angular.module('codegoblins.controller')
  .controller('profileCtrl', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', function($scope, Refs, Profiles, $rootScope, toastr, $timeout) {

    $rootScope.user = Refs.rootRef.getAuth(); //get current authentication
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    var getCareer = (function() {
      Profiles.getProfile($rootScope.key, function(data) {
        if (data) {
          $timeout(function() {
            $scope.displayCareer = data.career;
            $scope.displayDesc = data.briefProfile;
            $scope.getProjects = data.projects;
          });
        }
      });
    })();

    $scope.editprofile = function() { //edit profile

      Profiles.updateProfile({
        briefProfile: $scope.briefProfile,
        career: $scope.career
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.briefProfile = '';
          $scope.career = '';
        }
      });
    };

    $scope.submitProject = function() {
      Refs.usersRef.child($rootScope.key).child('profile').child('projects').push($scope.session.projectUrl, function(err) {
        if (!err) {
          toastr.success('Successfully added project');
          $scope.session.projectUrl = '';
        }
      });
    };
    // $scope.getProjects = Refs.usersRef.child($rootScope.user.auth.uid).child('profile').child('projects').on('value', function(snapshot) {
    //   console.log(snapshot.val());
    // }, function(errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });

  }]);

// angular.module('codegoblins.controller')
//   .controller('usersCtrl', ['$scope', '$http', '$rootScope', 'Refs', 'Profiles', '$timeout', '$stateParams', function($scope, $http, $rootScope, Refs, Profiles, $timeout, $stateParams) {

//     $scope.focus = function() {
//     	 $http.get('/users/' + $stateParams.id).success(function(data) {
    	 		
//     	 		console.log($stateParams.id);
// 		      console.log('getting', data);
//           $timeout(function() {
//             $scope.userDetails = data;
//           });
		    
// 	    });
//     }
   


//   }]);
 // angular.module('codegoblins.controller')

	// .controller('Auth', ['$firebaseAuth', function($firebaseAuth) {
	//   return $firebaseAuth(ref);
	// }]);

angular.module('codegoblins.service')
  .factory('Profiles', ['Refs', '$rootScope', function(Refs, $rootScope) {
    return {
      getProfile: function(userId, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').on('value', function(snap) {
          if (snap) {
            cb(snap.val());
          } else {
            cb();
          }

        });
      },
      updateProfile: function(userStats, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').update(userStats, function(error) {
          if (error) {
            cb(error)
          } else {
            cb();
          }
        });
      }
    };
  }]);

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

angular.module('codegoblins.service')
  .factory('Users', ['$http', '$stateParams', function($http, $stateParams) {
    return {

      findAll: function(cb) {
        return $http.get('/users')
          .success(function(data, status, headers, config) {
            return data;
          })
          .error(function(data, status, headers, config) {
            return ({status: 'false'});
          });
      },

      findOne: function(cb) {
        return $http.get('/users/' + $stateParams.id)
          .success(function(data, status, headers, config) {
            return data;
          })
          .error(function(data, status, headers, config) {
            return ({status: 'false'});
          });
      }
    };

  }]);