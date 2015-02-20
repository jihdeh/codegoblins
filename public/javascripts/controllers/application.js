'use strict';
angular.module('codegoblins.service', []);
angular.module('codegoblins.controller', []);
angular.module('CodeGoblins', [
  'ui.router', 
  'firebase',
  'codegoblins.controller',
  'codegoblins.service'
])
.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("home");
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
      .state('home', {
        url: '/',
        templateUrl: 'views/partials/index.client.view.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/partials/about.html'
      })
      .state('profile', {
        controllerProvider: 'HomeCtrl',
        url: '/profile',
        templateUrl: 'views/users/profile.client.view.html',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
});

