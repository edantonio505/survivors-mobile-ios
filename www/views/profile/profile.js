angular.module('starter')
.controller('ProfileCtrl', function(
	$scope, 
	$http, 
	SNURL, 
	$ionicPopup, 
	$state, 
	$rootScope, 
	EventService,
	$timeout,
	$ionicLoading
){
	$scope.user = [];
	$scope.topics_count = 0;
	$scope.connections_count = 0;
	$scope.inspired_count = 0;

	$rootScope.$watch('inspired_count', function(newValue, oldValue){
		$scope.inspired_count = newValue;
	});

	$rootScope.$watch('connections_count', function(newValue, oldValue){
		$scope.connections_count = newValue;
	});

	$rootScope.$watch('topics_count', function(newValue, oldValue){
		$scope.init();
	});

	$rootScope.$watch('username', function(newValue, oldValue){
		$scope.user.name = newValue;
	});

	$rootScope.$watch('avatar', function(newValue, oldValue){
		$scope.user.avatar = newValue;
	});

	$scope.init = function(){
		$http.get(SNURL+'authenticate/user')
		.success(function(response){
			$scope.user = response.user;
			EventService.handleProfileChanges(response);
			$scope.topics_count = $rootScope.topics_count;
			$scope.connections_count = $rootScope.connections_count;
			$scope.inspired_count = $rootScope.inspired_count;
			$ionicLoading.hide();
		})
		.error(function(error){
			$ionicPopup.alert({
		     title: 'Error',
		     template: 'Check your internet connection or try again later.'
		   });
		});
	};

	$scope.checkTopic = function(id){
		$state.go('tab.profile_topic', {id: id});
	};

	$ionicLoading.show();
	$timeout(function(){
		$scope.init();
	}, $timeout);
	
});