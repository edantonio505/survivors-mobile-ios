angular.module('starter')
.controller('CommentsCtrl', function(
	$http, 
	$scope, 
	$stateParams, 
	SNURL, 
	$ionicLoading, 
	$timeout, 
	$rootScope,
	AuthService
){
	var AuthUserName = localStorage.getItem('user.name');
	var AuthUserAvatar = localStorage.getItem('user.avatar');
	$scope.comments = [];
	$scope.topic = $stateParams;

	$scope.init = function(){
		AuthService.status();
		$http.get(SNURL+'comments/'+$stateParams.id)
		.success(function(response){
			$scope.body = response.body;
			$scope.user = response.post_user;
			$scope.user_avatar = response.post_user_avatar;
			$scope.comments = response.comments;
			$scope.created_time = response.created_time;
			$scope.tags = response.tags;
			$ionicLoading.hide();
		});
	};

	$scope.submitComment = function(newComment){
		var addComment = {
			body: newComment,
			user_name: AuthUserName,
			user_avatar: AuthUserAvatar
		};
		$http.post(SNURL+'post_comment/'+$stateParams.id+'/'+AuthUserName, {
			body: newComment
		})
		.error(function(response){
			alert('There was an error');
		});
		$scope.comments.push(addComment);
		var textarea = document.getElementsByClassName('newComment');
		angular.forEach(textarea, function(key){
			key.value = '';
		});
	};

	$rootScope.$watch('newComments', function(newValue, oldValue){
		$scope.init();
	});

	$ionicLoading.show();
	$timeout(function(){
		$scope.init();
	});
	
})





/*-----------------------------------------------------------------
							USER PROFILE CONTROLLER
-------------------------------------------------------------------*/

.controller('CommentsUserCtrl', function(
	$scope, 
	$http, 
	$stateParams, 
	SNURL, 
	UsersConnectionService, 
	$state, 
	$rootScope,
	$ionicPopup
){
	$scope.AuthUserEmail = localStorage.getItem('user.email');

	$http.get(SNURL+'get_user_by/'+$stateParams.name+'/'+$scope.AuthUserEmail).
	success(function(response){
		$scope.user = response.user;
		$scope.status = response.user.status;
		$avatarContainer = document.getElementById('avatarContainer');
		$avatarContainer.addEventListener("load", function(){
			this.style.visibility = 'visible';
		}, true);
	});
	
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