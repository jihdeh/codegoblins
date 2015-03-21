angular.module('codegoblins.service')
  .factory('Profiles', ['Refs', '$rootScope', function(Refs, $rootScope) {
    return {
      getProfile: function(userId, cb) {
        Refs.usersRef.child($rootScope.key).child('profile').on('value', function(snap) {
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
      }
    };
  }]);
