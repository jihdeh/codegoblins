angular.module('codegoblins.controller')
  .controller('public_questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', '$location', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions, $location) {

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    Questions.findOne().then(function(response) {
      $scope.questionData = response.data;
    }, function(err) {
      console.log('error occured');
    });

    // $location.search('search', ['erre', 'uwww']);

    Questions.findAll().then(function(response) {
      $scope.getAllQuestions = response.data;
      angular.forEach(response.data, function(value, key) {
        angular.forEach(value.tags, function(val, key) {
          $scope.the_tags = val;
        });
      });
    }, function(err) {
      swal({
        title: 'OOPS!!',
        text: 'An error occured, please try later',
        type: 'error'
      });
    });

    /* * * DISQUS CONFIGURATION VARIABLES * * */
    var disqus_shortname = 'codegoblins';

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
      var dsq = document.createElement('script');
      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

  }]);
