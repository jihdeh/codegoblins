angular.module('codegoblins.controller')
  .controller('public_questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions) {

     Questions.findOne().then(function(response) {
      console.log(response.data);
      $scope.questionData = response.data;
    }, function(err) {
      console.log('error occured');
    });

     console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
}]);