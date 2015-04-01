angular.module('codegoblins.controller')
  .controller('questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http) {
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
      Refs.questionsRef.push({
        questionTopic: $scope.topic,
        questionBody: $scope.body,
        uid: $rootScope.key,
        plnkr_link: $scope.plnkr_link || 'false',
        timestamp: new Date().getTime()
      }, function(err) {
        if(!err) {
          console.log('no error for top and body');
        } else {
          console.log('error occured for top and body');
        }
      });
      Refs.tagsRef.push($scope.tags, function(err) {
        if(!err) {
          console.log('no shits');
        } else {
          console.log('shitz');
        }
      });

    };

  Refs.questionsRef.orderByChild('uid').equalTo($rootScope.key).once('value', function(snap) {
    if(snap) {
      console.log(snap.val());
    } else {
      console.log('no data');
    }
  });

  }]);
