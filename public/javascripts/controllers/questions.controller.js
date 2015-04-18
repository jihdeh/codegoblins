angular.module('codegoblins.controller')
  .controller('questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', '$location', '$window', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions, $location, $window) {
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    $(document).ready(function() {
      $('.showOnload-preloader').hide();
      $('.plnkr-div').hide();
      $('.plnkr_link').focusout(function() {
        $scope.plnkr_link = $('.plnkr_link').val();

        if ($scope.plnkr_link && $scope.plnkr_link.substring(0, 4) !== 'http') {
          $scope.plnkr_link = 'http://' + $scope.plnkr_link;
        }
        // var plnkr_iframe = '';
        if ($scope.plnkr_link) {
          $('.showOnload-preloader').show();
          $('.plnkr-pane').load(function() {
            $('.plnkr-div').show();
            $('.showOnload-preloader').hide();
            $('.plnkr-pane').addClass('embed-frame');
          });
        };
      });
    });

    $scope.submitQuestion = function() {
      //save question details
      $scope.push_key = Refs.questionsRef.push({
        questionTopic: $scope.topic,
        questionBody: $scope.body,
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

    // Refs.questionsRef.orderByChild('uid').equalTo($rootScope.key).once('value', function(snap) {
    //   if (snap) {
    //     console.log(snap.val());
    //   } else {
    //     console.log('no data');
    //   }
    // });



  }]);
