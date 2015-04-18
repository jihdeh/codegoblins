angular.module('codegoblins.controller')
  .controller('public_questions', ['$scope', 'Refs', 'Profiles', '$rootScope', '$stateParams', 'toastr', '$timeout', 'Users', 'SweetAlert', 'Questions', '$location', function($scope, Refs, Profiles, $rootScope, $stateParams, toastr, $timeout, Users, SweetAlert, Questions, $location) {

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    Questions.findOne().then(function(response) {
      $scope.questionData = response.data;
      if ($stateParams.id) {
        $scope.data = {
          cb: $scope.questionData.answered
        };
      }
    }, function(err) {
      console.log('error occured');
    });

    $(document).ready(function() {
      $('.showOnload-0').show();
      $('.plnkr_container').hide();
      $('.plnkr-pane').load(function() {
        $('.plnkr_container').show();
        $('.showOnload-0').hide();
        $('.plnkr-pane').addClass('embed-frame');
      });
    });

    $scope.markAnswer = function() {
      if ($scope.data.cb) {
        Refs.questionsRef.child($stateParams.id).update({
          answered: $scope.data.cb
        }, function(err) {
          if (!err) {
            swal({
              title: 'Bumaya!!',
              text: 'Question has been marked as answered',
              type: 'success'
            });
          } else {
            toastr.error('Error occured sending data, please try again');
          }
        });
      } else {
        Refs.questionsRef.child($stateParams.id).update({
          answered: false
        }, function(err) {
          if (!err) {
            swal({
              title: 'Uhmm!!',
              text: 'Question has been marked as unaswered',
              type: 'error'
            });
          } else {
            toastr.error('Error occured sending data, please try again');
          }
        });
      }
    };

    Questions.findAll().then(function(response) {
      $scope.getAllQuestions = response.data;
      $('.showOnload').hide();
      angular.forEach(response.data, function(value, key) {
        angular.forEach(value.tags, function(val, key) {
          $scope.the_tags = val;
        });
      });
    }, function(err) {
      swal({
        title: 'OOPS!!',
        text: 'An error occured, please try later or check your internet connection',
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
