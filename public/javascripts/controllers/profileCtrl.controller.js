angular.module('codegoblins.controller')
  .controller('profileCtrl', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', function($scope, Refs, Profiles, $rootScope, toastr, $timeout) {

    $rootScope.user = Refs.rootRef.getAuth(); //get current authentication
    $rootScope.key = Refs.usersRef.child($rootScope.user.auth.uid).key();

    var getCareer = (function() {
      Profiles.getProfile($rootScope.key, function(data) {
        if (data) {
          $timeout(function() {
            $scope.displayCareer = data.career;
            $scope.displayDesc = data.briefProfile;
            $scope.getProjects = data.projects;
          });
        }
      });
    })();

    $scope.editprofile = function() { //edit profile

      Profiles.updateProfile({
        briefProfile: $scope.briefProfile,
        career: $scope.career
      }, function(err) {
        if (!err) {
          toastr.success('Successfully saved');
          $scope.briefProfile = '';
          $scope.career = '';
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
    // $scope.getProjects = Refs.usersRef.child($rootScope.user.auth.uid).child('profile').child('projects').on('value', function(snapshot) {
    //   console.log(snapshot.val());
    // }, function(errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });

  }]);
