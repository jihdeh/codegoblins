angular.module('codegoblins.controller')
  .controller('profile', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog) {

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

    $scope.editCareerProfile = function() {
      Profiles.updateProfile({
        career: $scope.career
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.career = '';
          SweetAlert.swal('Data Saved!', 'New Career: ' + $scope.displayCareer, 'success');
        }
      });
    };

    //*bit of wet code here(open for refactoring)
    Refs.usersRef.child($rootScope.key).child('profile').once('value', function(snap) {
      if (snap) {
        $scope.getNickNameStatus = snap.val().nickname;
        if (!$scope.getNickNameStatus) {
          $timeout(function() {
            $('#icon_prefix').focus().val('This field is required');
          });
        }
      } else {
        console.log('nope');
      }
    });

    $scope.editNickNameProfile = function() {
      Profiles.updateProfile({
        nickname: $scope.nickName
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.nickName = '';
          SweetAlert.swal('Data Saved!', 'New Nick-Name: ' + $scope.displayNick, 'success');
        }
      });
    };

    $scope.editProfileMessage = function() {
      Profiles.updateProfile({
        briefProfile: $scope.briefProfile
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.briefProfile = '';
          SweetAlert.swal('Data Saved!', 'New Pm: ' + $scope.displayDesc, 'success');
        }
      });
    };

    $scope.submitProject = function() {
      Refs.usersRef.child($rootScope.key).child('profile').child('projects').push($scope.session.projectUrl, function(err) {
        if (!err) {
          toastr.success('Successfully added project');
          $scope.session.projectUrl = '';
        }
      });
    };


    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'
    ];
    $scope.series = ['Series A', 'Series B'];
    $scope.colours = ['red', 'purple'];
    $scope.options = {
      animation: false
    }
    $scope.data = [
      [35, 54, 40, 41, 56, 55, 40, 32, 54, 55, 20, 47],
      [24, 44, 40, 67, 46, 27, 20, 32, 54, 55, 20, 47]
    ];
    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };

    $scope.project = {
      description: 'Nuclear Missile Defense System',
      rate: 500
    };

  }]);
