 angular.module('codegoblins.service')

 .factory('insertUserData', ['Refs', '$firebase', function(Refs, $firebase) {
		var ref = Refs.rootRef.usersRef;
		return $firebase(ref).$asArray();
		console.log(Refs.rootRef.usersRef);
	}]);