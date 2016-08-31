angular.module('starter')
.controller('NetworkCtrl', function($scope, $http, SNURL, $state, $rootScope, AuthService){
	var AuthEmail = localStorage.getItem('user.email');

	$scope.init = function(){
		AuthService.status();
		$http.get(SNURL+'get_connections?AuthEmail='+AuthEmail)
		.success(function(response){
			$scope.connections = response;
		});
	};

	$rootScope.$watch('connections_count', function(newValue, oldValue){
		$scope.init();
	});

	$scope.$on("$ionicView.enter", function(event, data){
		if($rootScope.youAccepted_user === true){
			$scope.init();
			$rootScope.youAccepted_user = false;
		}
	});

	$scope.init();
})





/*-----------------------------------------------------------------
							USER PROFILE CONTROLLER
-------------------------------------------------------------------*/
.controller('ConnectionProfileCtrl', function(
	$scope, 
	$http, 
	SNURL, 
	$stateParams, 
	$state,
	$ionicPopup
){
	$http.get(SNURL+'get_user_byid/'+$stateParams.id)
	.success(function(response){
		$avatarContainer = document.getElementById('avatarContainer');
		$avatarContainer.addEventListener("load", function(){
			this.style.visibility = 'visible';
		}, true);

		$scope.user = response.user;
		$scope.status = 'Connected';
	});

	$scope.checkTopic = function(id){
		$state.go('tab.network_topic', {id: id});
	};


	// =========================REPORT USER===========================
		$scope.showMenu = function(){
			$ionicPopup.show({
				title: '<i class="ion-alert"></i> Report This User',
				subTitle: 'Is this user posting questionable content?<br /> Please explain briefly. We will take action immediately.',
				scope: $scope,
				template: '<textarea style="height: 40px;" ng-model="report"></textarea>',
				buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
				    text: 'Cancel',
				    type: 'button-assertive',
				}, {
				    text: 'REPORT',
				    type: 'button-positive',
				    onTap: function(e) {
				      // Returning a value will cause the promise to resolve with the given value.
				    	$http.post(SNURL+'report',{
				    		username: $scope.user.name,
				    		report: this.scope.report
				    	})
				    	.success(function(data){
				    		console.log(data);
				    	});
				      // return this.scope.data.response;
				    }
				}]
			});

		};
	// ===============================================================
});