angular.module('codegoblins.controller')
  .controller('publicProfile', ['$scope', 'Refs', 'Profiles', '$rootScope', '$stateParams', 'toastr', '$timeout', 'Users', 'SweetAlert', '$modal', '$log', '$mdDialog', function($scope, Refs, Profiles, $rootScope, $stateParams, toastr, $timeout, Users, SweetAlert, $modal, $log, $mdDialog) {

    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();
    var getCareer = (function() {
      Profiles.getProfile($rootScope.key, function(data) {
        if (data) {
          $timeout(function() {
            $scope.displayAvatar = data.avatar;
            $scope.displayCareer = data.career;
            $scope.displayDesc = data.briefProfile;
            $scope.displayNick = data.nickname;
            $scope.getProjects = data.projects;
          });
        }
      });
    })();

    Users.findOne().then(function(response) {
      $scope.userDetails = response.data;
      $scope.getCommendationLen = _.toArray($scope.userDetails.commendations).length;
      Profiles.getCommendationData($stateParams.id, function(data) {
        if (data) {
          $timeout(function() {
            $scope.commendsData = data;
            for (var prop in $scope.commendsData) {
              if ($scope.commendsData[prop].uid == $rootScope.key) {
                $('#btn-commends').text('You have already commended this person').attr('disabled', true);
              }
            }
          });
        } else {
          console.log('error occured');
        }
      });
    }, function(error) {
      return 'No data returned';
    });

    var alert;
    $scope.showAlert = showAlert;
    $scope.showDialog = showDialog;

    function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        content: 'This is an example of how easy dialogs can be!',
        ok: 'Close',
        clickOutsideToClose: true
      });
      $mdDialog
        .show(alert)
        .finally(function() {
          alert = undefined;
        });
    }

    function showDialog($event) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: '/views/partials/commendation.client.view.html',
        locals: {
          sendCommend: $scope.sendCommend
        },
        bindToController: true,
        clickOutsideToClose: true,
        disableParentScroll: false,
        controller: DialogController
      });

      function DialogController(scope, $mdDialog, sendCommend) {

        scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    };

    $scope.sendCommend = function() {
      if (!$scope.displayNick) {
        toastr.error('Kindly Update Your Nickname');
        $mdDialog.hide();
        setTimeout(function() {
          window.location = '/profile';
        }, 5000);
      } else {
        Profiles.updateCommendation({
          avatar: $scope.displayAvatar,
          nickname: $scope.displayNick,
          topic: $scope.topic,
          commends: $scope.commend,
          uid: $rootScope.key.toString()
        }, function(err) {
          if (!err) {
            toastr.success('Successfully sent');
            SweetAlert.swal('Data Sent!', 'Thank you', 'success');
          } else {
            toastr.error('An error occured, please try again');
          }
        });
        $mdDialog.hide();

      }
    };

  }]);
