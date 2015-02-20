'use strict';
angular.module('codegoblins.controller', []);
angular.module('codegoblins.service', []);
angular.module('CodeGoblins', [
  'ui.router', 
  'firebase'
])

.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("home");
    }
  });
}]);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
      .state('home', {
        url: '/',
        templateUrl: 'public/views/index.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'public/views/partials/about.html'
      })
      .state('profile', {
        controllerProvider: 'HomeController',
        url: '/profile',
        templateUrl: 'public/views/users/profile.client.view.html',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
});

