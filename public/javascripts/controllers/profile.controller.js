angular.module('codegoblins.controller')
  .controller('profile', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert) {

    $rootScope.user = Refs.rootRef.getAuth(); //get current authentication
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    var getCareer = (function() {
        Profiles.getProfile($rootScope.key, function(data) {
            if (data) {
                $timeout(function() {
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
            SweetAlert.swal('Data Saved!', 'New Career: '+ $scope.displayCareer, 'success');
          }
      });
    };

    $scope.editNickNameProfile = function() {
      Profiles.updateProfile({
          nickname: $scope.nickName
      }, function(err) {
          if (!err) {
            toastr.success('Successfully saved');
            $scope.nickName = '';
            SweetAlert.swal('Data Saved!', 'New Nick-Name: '+ $scope.displayNick, 'success');
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
            SweetAlert.swal('Data Saved!', 'New Nick-Name: '+ $scope.displayDesc, 'success');
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

    Users.findOne().then(function(response) {
        $scope.userDetails = response.data;
    }, function(error) {
        return 'No data returned';
    });

    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                      'November', 'December'];
    $scope.series = ['Series A', 'Series B'];
    $scope.colours = ['red', 'purple'];
    $scope.options = {
        animation: false
    }
    $scope.data = [
      [35, 78, 80, 81, 56, 55, 40, 32, 54, 55, 20, 47],
      [28, 48, 40, 67, 86, 27, 20, 32, 54, 55, 20, 87]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

  }]);
