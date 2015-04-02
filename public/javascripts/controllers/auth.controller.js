angular.module('codegoblins.controller')
  .controller('AuthCtrl', ['$scope', '$location', '$timeout', 'Refs', '$rootScope', function($scope, $location, $timeout, Refs, $rootScope) {
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
