angular.module('starter')



/*-----------------------------------------------------------------
							USER PROFILE CONTROLLER
-------------------------------------------------------------------*/
.controller('UserProfileCtrl', function(
	$scope, 
	$http, 
	$stateParams, 
	SNURL, 
	$ionicLoading, 
	$timeout, 
	UsersConnectionService, 
	$state,
	$rootScope,
	AuthService,
	$ionicPopup
){
	$scope.AuthUserEmail = localStorage.getItem('user.email');

	$ionicLoading.show();
	$timeout(function(){
		$http.get(SNURL+'get_user/'+$stateParams.topicId+'/'+$scope.AuthUserEmail)
		.success(function(response){
			$scope.user = response.user;
			$scope.status = response.user.status;
			$avatarContainer = document.getElementById('avatarContainer');
			$avatarContainer.addEventListener("load", function(){
				this.style.visibility = 'visible';
			}, true);
			$ionicLoading.hide();
		});
	}, $timeout);

	$scope.connect = function(username){
		$scope.status = UsersConnectionService.connect(username);
	};

	$scope.accept = function(username){
		$scope.status = UsersConnectionService.accept(username);
		$rootScope.connections_count += 1;
		$rootScope.youAccepted_user = true;
	};

	$scope.addConnection = function(username){
		if($scope.status == 'Accept')
		{
			$scope.accept(username);
		} else {
			$scope.connect(username);
		}
	};

	$scope.checkTopic = function(id){
		$state.go('tab.home_topic', {id: id});
	};


	AuthService.status();



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