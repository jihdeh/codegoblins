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
