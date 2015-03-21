'use strict';
angular.module('codegoblins.service', []);
angular.module('codegoblins.controller', []);
angular.module('CodeGoblins', [
        'ui.router',
        'ngAnimate',
        'toastr',
        'firebase',
        'mentio',
        'codegoblins.controller',
        'codegoblins.service'
    ])
.run(["$rootScope", "$state", 'Refs', function($rootScope, $state, Refs) {
  $rootScope._ = window._;
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, error) {
    // and redirect the user back to the home page
      // var states = (toState.name !== 'signup' && toState.name !== 'login' && toState.name !== 'reset-password' && toState.name !== 'error_404');
      //  console.log('ahahahha');
      //  if(states) {
      //   console.log(states);
      //   event.preventDefault();
      //   $state.go('error_404');
      //  }
      //  else {
      //   console.log('deeper');
      //  }
  });
}])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
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
                    templateUrl: 'views/users/profile.client.view.html'
                })
                .state('browse', {
                    url: '/browse',
                    templateUrl: 'views/users/browse.client.view.html'
                })
                .state('users', {
                  url: '/browse/:id',
                  templateUrl: 'views/users/userbrowse.client.view.html',
                  controller: function($scope, $stateParams) {

                  }
                })
                .state('error_404', {
                    url: '/error_404',
                    templateUrl: 'views/error.html'
                });
        }]);

