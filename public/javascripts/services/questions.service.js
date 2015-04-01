angular.module('codegoblins.service')
  .factory('Questions', ['$http', '$stateParams', function ($http, $stateParams) {
    // body...
    return {

      findAll: function(cb) {
        return $http.get('/all/questions')
          .success(function(data, status, headers, config){
            return data;
          })
          .error(function(data, status, headers, config) {
            return data;
          });
      },

      findOne: function(cb) {
        return $http.get('/questions/'+ $stateParams.id)
          .success(function(data, status, headers, config) {
            return data;
          })
          .error(function(data, status, headers, config) {
            return data;
          });
      }
    }
  }])