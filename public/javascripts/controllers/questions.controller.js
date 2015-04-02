angular.module('codegoblins.controller')
  .controller('questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions) {
        $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

        $(document).ready(function() {
          $('.load_preloader').hide();
          $('.plnkr_link').focusout(function() {
            $scope.plnkr_link = $('.plnkr_link').val();

            if ($scope.plnkr_link && $scope.plnkr_link.substring(0, 4) !== 'http') {
              $scope.plnkr_link = 'http://' + $scope.plnkr_link;
            }
            var plnkr_iframe = '<iframe style="border: 1px solid #999; width: 100%; height: 700px; background-color: #fff;" src="' + $scope.plnkr_link + '" width="320" height="240" frameborder="0" allowfullscreen="allowfullscreen"></iframe>';
            if ($scope.plnkr_link) {
              $('.plnkr-div').html(plnkr_iframe);
              $('.load_preloader').hide();
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
              tags: $scope.tags
            }, function(err) {
              if (!err) {
                console.log('no error for top and body');
              } else {
                swal({
                    title: 'OOPS!!',
                    text: 'An error occured, please try later',
                    type: 'error',
                    timer: 3000);

                }
              });
            // save push key
            Refs.questionsRef.child($scope.push_key.key()).update({
                push_key: $scope.push_key.key()
              }, function(err) {
                if (!err) {
                  console.log('No error pushing key');
                } else {
                  swal({
                      title: 'OOPS!!',
                      text: 'An error occured, please try later',
                      type: 'error',
                      timer: 3000);

                  }
                });
            };

            Refs.questionsRef.orderByChild('uid').equalTo($rootScope.key).once('value', function(snap) {
              if (snap) {
                console.log(snap.val());
              } else {
                console.log('no data');
              }
            });

            Questions.findAll().then(function(response) {
                $scope.getAllQuestions = response.data;
                angular.forEach(response.data, function(value, key) {
                  console.log(key, value.tags);
                  angular.forEach(value.tags, function(val, key) {
                    $scope.the_tags = val;
                  });
                });
              }, function(err) {
                swal({
                    title: 'OOPS!!',
                    text: 'An error occured, please try later',
                    type: 'error',
                    timer: 3000);
                });



            }]);
