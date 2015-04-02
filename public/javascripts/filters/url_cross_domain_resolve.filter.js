angular.module('codegoblins.filter')
  .filter('trusted', ['$sce', function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
