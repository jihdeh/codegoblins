angular.module('codegoblins.controller')
  .controller('public_questions', ['$scope', 'Refs', 'Profiles', '$rootScope', 'toastr', '$timeout', 'Users', 'SweetAlert', '$mdDialog', '$http', 'Questions', function($scope, Refs, Profiles, $rootScope, toastr, $timeout, Users, SweetAlert, $mdDialog, $http, Questions) {

    Questions.findOne().then(function(response) {
      $scope.questionData = response.data;
    }, function(err) {
      console.log('error occured');
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
