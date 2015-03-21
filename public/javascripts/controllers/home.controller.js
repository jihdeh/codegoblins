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
