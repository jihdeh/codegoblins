angular.module('codegoblins.service')
  .factory('Questions', ['$http', '$stateParams', 'Refs', function ($http, $stateParams, Refs) {
    // body...
    return {

      findAll: function(cb) {
        return $http.get('/api/v1/questions')
          .success(function(data, status, headers, config){
            return data;
          })
          .error(function(data, status, headers, config) {
            return data;
          });
      },

      findOne: function(cb) {
        return $http.get('/api/v1/questions/'+ $stateParams.id)
          .success(function(data, status, headers, config) {
            return data;
          })
          .error(function(data, status, headers, config) {
            return data;
          });
      },

      getChildKey: function(cb) {
        Refs.questionsRef.on('value', function(err) {
          if(err) {
            cb(err);
          } else {
            cb();
          }
        });
      }
    }
  }]);