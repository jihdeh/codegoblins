angular.module('codegoblins.controller')
  .controller('MainCtrl', ['$scope', 'Refs', 'Questions', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', function($scope, Refs, Questions, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog) {
    var tagArray = [];

    Questions.findAll().then(function(response) {
      $scope.getAllQuestions = response.data;
      angular.forEach(response.data, function(value, key) {
        angular.forEach(value.tags, function(val, key) {
          tagArray.push(val.lang);
          $scope.sortTags = _.union(tagArray);
        });
      });
    }, function(err) {
      swal({
        title: 'OOPS!!',
        text: 'An error occured, please try later',
        type: 'error'
      });
    });

}]);