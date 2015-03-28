angular.module('codegoblins.service')
  .factory('Profiles', ['Refs', '$rootScope', '$stateParams', function(Refs, $rootScope, $stateParams) {
    return {
      getProfile: function(userId, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').once('value', function(snap) {
          if (snap) {
            cb(snap.val());
          } else {
            cb();
          }

        });
      },
      updateProfile: function(userStats, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').update(userStats, function(error) {
          if (error) {
            cb(error)
          } else {
            cb();
          }
        });
      },
      updateCommendation: function(commendations, cb) {
        Refs.usersRef.child($stateParams.id).child('commendations').child($rootScope.key).update(commendations, function(error) {
          if (error) {
            cb(error)
          } else {
            cb();
          }
        });
      },
      getCommendationData: function(getCommends, cb) {
        Refs.usersRef.child($stateParams.id).child('commendations').on('value', function(snap) {
          if (snap) {
            cb(snap.val());
          } else {
            cb();
          }
        });
      }
    }
  }]);
