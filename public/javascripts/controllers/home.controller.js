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
