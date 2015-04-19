angular.module('codegoblins.controller')
  .controller('QuestionsCtrl', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', '$location', '$window', '$stateParams', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions, $location, $window, $stateParams) {
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    $(document).ready(function() {
      $('.showOnload-preloader').hide();
      $('.plnkr-div').hide();
      $('.plnkr_link').on('focusout', function() {
        $scope.plnkr_link = $('.plnkr_link').val();

        if ($scope.plnkr_link && $scope.plnkr_link.substring(0, 4) === 'http') {
          $scope.plnkr_link = '//' + $scope.plnkr_link;
        }

        if ($scope.plnkr_link !== '') {
          // $('.showOnload-preloader').show();
          $('.plnkr-pane').load(function() {
            $('.plnkr-div').show();
            $('.plnkr-pane').addClass('embed-frame');
            $('.showOnload-preloader').hide();
          });
        };
      });
    });


    Questions.findOne().then(function(response) {
      $scope.questionData = response.data;
    }, function(err) {
      toastr.error('Error occured fetching data, please reload page');
    });

    $scope.updateQuestion = function(questionData) {
      Refs.questionsRef.child($stateParams.id).update(questionData, function(err) {
        if (!err) {
          swal({
            title: 'OHHyEAH!!',
            text: 'Question has been updated',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
          }, function() {
            $window.location = '/question/' + $stateParams.id;
          });
        } else {
          swal({
            title: 'OOPS!!',
            text: 'An error occured, please try later or check your internet connection',
            type: 'error'
          });
        }
      })
    };
    $scope.data = {
      content: '## hello world'
    };
    
    $scope.submitQuestion = function() {
      //save question details
      $scope.push_key = Refs.questionsRef.push({
        questionTopic: $scope.topic,
        questionBody: $scope.markdownText,
        uid: $rootScope.key,
        plnkr_link: $scope.plnkr_link || 'false',
        avatar: $rootScope.user.google.cachedUserProfile.picture,
        timestamp: new Date().getTime(),
        tags: $scope.tags,
        answered: false
      }, function(err) {
        if (!err) {

        } else {
          swal({
            title: 'OOPS!!',
            text: 'An error occured, please try later or check your internet connection',
            type: 'error'
          });
        }
      });
      // save push key
      Refs.questionsRef.child($scope.push_key.key()).update({
        push_key: $scope.push_key.key()
      }, function(err) {
        if (!err) {
          swal({
              title: 'Cool!!',
              text: 'Question has been created',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, create it!",
              closeOnConfirm: false
            },

            function() {
              $window.location = '/question/' + $scope.push_key.key();
            });
        } else {
          swal({
            title: 'OOPS!!',
            text: 'An error occured, please try later or check your internet connection',
            type: 'error'
          });
        }
      });
    };


  }]);
