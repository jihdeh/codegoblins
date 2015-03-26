$(document).ready(function() {
  $('.button-collapse').sideNav(); //button collapse
   $('.slider').slider({full_width: true}); //home slider
   $('.parallax').parallax();

   (function(){
// set up the timeout variable
var t;
// setup the sizing function,
// with an argument that tells the chart to animate or not
function size(animate){
    // If we are resizing, we don't want the charts drawing on every resize event.
    // This clears the timeout so that we only run the sizing function
    // when we are done resizing the window
    clearTimeout(t);
    // This will reset the timeout right after clearing it.
    t = setTimeout(function(){
        $("canvas").each(function(i,el){
            // Set the canvas element's height and width to it's parent's height and width.
            // The parent element is the div.canvas-container
            $(el).attr({
                "width":$(el).parent().width(),
                "height":$(el).parent().outerHeight()
            });
        });
        // kickoff the redraw function, which builds all of the charts.
        redraw(animate);

        // loop through the widgets and find the tallest one, and set all of them to that height.
        var m = 0;
        // we have to remove any inline height setting first so that we get the automatic height.
        $(".widget").height("");
        $(".widget").each(function(i,el){ m = Math.max(m,$(el).height()); });
        $(".widget").height(m);

    }, 100); // the timeout should run after 100 milliseconds
}
$(window).on('resize', size);
function redraw(animation){
    var options = {};
    if (!animation){
        options.animation = false;
    } else {
        options.animation = true;
    }
    // ....
        // the rest of our chart drawing will happen here
    // ....
}
size(); // this kicks off the first drawing; note that the first call to size will animate the charts in.
})();

});
'use strict';
angular.module('codegoblins.service', []);
angular.module('codegoblins.controller', []);
angular.module('codegoblins.filter', []);
angular.module('CodeGoblins', [
        'ui.router',
        'ngAnimate',
        'toastr',
        'lumx',
        'chart.js',
        'firebase',
        'mentio',
        'oitozero.ngSweetAlert',
        'codegoblins.controller',
        'codegoblins.service',
        'codegoblins.filter'
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
                  url: '/profile/:id',
                  templateUrl: 'views/users/public_profile.client.view.html',
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

    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();
    console.log($rootScope.user);
    Users.findAll().then(function(response) {
      $scope.users = response.data;
    }, function(error) {
      return 'Error Occured';
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
  .controller('profile', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert) {

    $rootScope.user = Refs.rootRef.getAuth(); //get current authentication
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    var getCareer = (function() {
        Profiles.getProfile($rootScope.key, function(data) {
            if (data) {
                $timeout(function() {
                    $scope.displayCareer = data.career;
                    $scope.displayDesc = data.briefProfile;
                    $scope.displayNick = data.nickname;
                    $scope.getProjects = data.projects;
                });
            }
        });
    })();

    $scope.editCareerProfile = function() {
      Profiles.updateProfile({
          career: $scope.career
      }, function(err) {
          if (!err) {
            toastr.success('Successfully saved');
            $scope.career = '';
            SweetAlert.swal('Data Saved!', 'New Career: '+ $scope.displayCareer, 'success');
          }
      });
    };

    $scope.editNickNameProfile = function() {
      Profiles.updateProfile({
          nickname: $scope.nickName
      }, function(err) {
          if (!err) {
            toastr.success('Successfully saved');
            $scope.nickName = '';
            SweetAlert.swal('Data Saved!', 'New Nick-Name: '+ $scope.displayNick, 'success');
          }
      });
    };

    $scope.editProfileMessage = function() {
      Profiles.updateProfile({
          briefProfile: $scope.briefProfile
      }, function(err) {
          if (!err) {
            toastr.success('Successfully saved');
            $scope.briefProfile = '';
            SweetAlert.swal('Data Saved!', 'New Nick-Name: '+ $scope.displayDesc, 'success');
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

    Users.findOne().then(function(response) {
        $scope.userDetails = response.data;
    }, function(error) {
        return 'No data returned';
    });

    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                      'November', 'December'];
    $scope.series = ['Series A', 'Series B'];
    $scope.colours = ['red', 'purple'];
    $scope.options = {
        animation: false
    }
    $scope.data = [
      [35, 78, 80, 81, 56, 55, 40, 32, 54, 55, 20, 47],
      [28, 48, 40, 67, 86, 27, 20, 32, 54, 55, 20, 87]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

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
angular.module('codegoblins.filter')
  .filter('array', function() {
      return function(items) {
          var filtered = [];
          angular.forEach(items, function(item) {
              filtered.push(item);
          });
          return filtered;
      };
  });
