angular.module('codegoblins.controller')
.controller('profileCtrl', ['$scope', 'insertUserData', function($scope, insertUserData){

	$scope.user = $scope.auth.$getAuth();
	console.log('profile is in control');

	$scope.editprofile = function() {
		console.log('function is fired');
	}

}]);