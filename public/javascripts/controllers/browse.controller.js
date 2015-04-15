angular.module('codegoblins.controller')
  .controller('browse', ['$scope', '$http', '$rootScope', 'Refs', 'Profiles', '$timeout', 'Users', function($scope, $http, $rootScope, Refs, Profiles, $timeout, Users) {

    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();
    Users.findAll().then(function(response) {
      $('.showOnload').show();
      $scope.users = response.data;
      $('.showOnload').hide();
    }, function(error) {
      swal({
        title: 'OOPS!!',
        text: 'An error occured, please try later or check your internet connection',
        type: 'error'
      });
    });

}]);
