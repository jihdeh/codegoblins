$(document).ready(function() {
  $('.button-collapse').sideNav(); //button collapse
   $('.slider').slider({full_width: true}); //home slider
   $('.parallax').parallax();
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
        'ngMaterial',
        'ui.bootstrap',
        'ngMessages',
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
            uid: authData.uid
          });
          Refs.usersRef.child(authData.uid).child('profile').update({
            avatar: authData.google.cachedUserProfile.picture
          });
          $timeout(function() {
            $location.path('/profile');
            $rootScope.user = Refs.rootRef.getAuth();
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
  .controller('profile', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$modal', '$log', '$mdDialog', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $modal, $log, $mdDialog) {

    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    var getCareer = (function() {
      Profiles.getProfile($rootScope.key, function(data) {
        if (data) {
          $timeout(function() {
            $scope.displayAvatar = data.avatar;
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
          SweetAlert.swal('Data Saved!', 'New Career: ' + $scope.displayCareer, 'success');
        }
      });
    };

    //*bit of wet code here(open for refactoring)
    Refs.usersRef.child($rootScope.key).child('profile').once('value', function(snap) {
      if (snap) {
        $scope.getNickNameStatus = snap.val().nickname;
        if (!$scope.getNickNameStatus) {
          $timeout(function() {
            $('#icon_prefix').focus().val('This field is required');
          });
        }
      } else {
        console.log('nope');
      }
    });

    $scope.editNickNameProfile = function() {
      Profiles.updateProfile({
        nickname: $scope.nickName
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.nickName = '';
          SweetAlert.swal('Data Saved!', 'New Nick-Name: ' + $scope.displayNick, 'success');
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
          SweetAlert.swal('Data Saved!', 'New Nick-Name: ' + $scope.displayDesc, 'success');
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


    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'
    ];
    $scope.series = ['Series A', 'Series B'];
    $scope.colours = ['red', 'purple'];
    $scope.options = {
      animation: false
    }
    $scope.data = [
      [35, 78, 80, 81, 56, 55, 40, 32, 54, 55, 20, 47],
      [28, 48, 40, 67, 86, 27, 20, 32, 54, 55, 20, 87]
    ];
    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };

    $scope.project = {
      description: 'Nuclear Missile Defense System',
      rate: 500
    };

  }]);

angular.module('codegoblins.controller')
  .controller('publicProfile', ['$scope', 'Refs', 'Profiles', '$rootScope', '$stateParams', 'toastr', '$timeout', 'Users', 'SweetAlert', '$modal', '$log', '$mdDialog', function($scope, Refs, Profiles, $rootScope, $stateParams, toastr, $timeout, Users, SweetAlert, $modal, $log, $mdDialog) {

    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();
    var getCareer = (function() {
      Profiles.getProfile($rootScope.key, function(data) {
        if (data) {
          $timeout(function() {
            $scope.displayAvatar = data.avatar;
            $scope.displayCareer = data.career;
            $scope.displayDesc = data.briefProfile;
            $scope.displayNick = data.nickname;
            $scope.getProjects = data.projects;
          });
        }
      });
    })();

    Users.findOne().then(function(response) {
      $scope.userDetails = response.data;
      $scope.getCommendationLen = _.toArray($scope.userDetails.commendations).length;
      Profiles.getCommendationData($stateParams.id, function(data) {
        if (data) {
          $timeout(function() {
            $scope.commendsData = data;
            for(var prop in $scope.commendsData) {
              if($scope.commendsData[prop].uid == $rootScope.key) {
                $('#btn-commends').text('You have already commended this person').attr('disabled', true);
              }
            }
          });
        } else {
          console.log('error occured');
        }
      });
    }, function(error) {
      return 'No data returned';
    });

    var alert;
    $scope.showAlert = showAlert;
    $scope.showDialog = showDialog;

    function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        content: 'This is an example of how easy dialogs can be!',
        ok: 'Close',
        clickOutsideToClose: true
      });
      $mdDialog
        .show(alert)
        .finally(function() {
          alert = undefined;
        });
    }

    function showDialog($event) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: '/views/partials/commendation.client.view.html',
        locals: {
          sendCommend: $scope.sendCommend
        },
        bindToController: true,
        clickOutsideToClose: true,
        disableParentScroll: false,
        controller: DialogController
      });

      function DialogController(scope, $mdDialog, sendCommend) {

        scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    };

    $scope.sendCommend = function() {
      if (!$scope.displayNick) {
        toastr.error('Kindly Update Your Nickname');
        $mdDialog.hide();
        setTimeout(function() {
          window.location = '/profile';
        }, 5000);
      } else {
        Profiles.updateCommendation({
          avatar: $scope.displayAvatar,
          nickname: $scope.displayNick,
          topic: $scope.topic,
          commends: $scope.commend,
          uid: $rootScope.key.toString()
        }, function(err) {
          if (!err) {
            toastr.success('Successfully sent');
            SweetAlert.swal('Data Sent!', 'Thank you', 'success');
          } else {
            toastr.error('An error occured, please try again');
          }
        });
        $mdDialog.hide();

      }
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

 // angular.module('codegoblins.controller')

	// .controller('Auth', ['$firebaseAuth', function($firebaseAuth) {
	//   return $firebaseAuth(ref);
	// }]);

angular.module('codegoblins.service')
  .factory('Profiles', ['Refs', '$rootScope', '$stateParams', function(Refs, $rootScope, $stateParams) {
    return {
      getProfile: function(userId, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').once('value', function(snap) {
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
      },
      updateCommendation: function(commendations, cb) {
        Refs.usersRef.child($stateParams.id).child('commendations').child($rootScope.key).update(commendations, function(error) {
          if (error) {
            cb(error)
          } else {
            cb();
          }
        });
      },
      getCommendationData: function(getCommends, cb) {
        Refs.usersRef.child($stateParams.id).child('commendations').on('value', function(snap) {
          if (snap) {
            cb(snap.val());
          } else {
            cb();
          }
        });
      }
    }
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