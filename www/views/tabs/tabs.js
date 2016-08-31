angular.module('starter')
.controller('TabsCtrl', function(
	$scope, 
	AuthService, 
	$ionicModal, 
	SNURL, 
	$http, 
	$ionicLoading, 
	$timeout, 
	$state, 
	socket, 
	EventService,
	$rootScope,
	$ionicScrollDelegate
){
	$scope.hideTabs = false;


	var username = localStorage.getItem('user.name');
	$scope.searchBy = 'tag';
	$scope.newPosts = 0;
	$scope.notificationsCount = $rootScope.notificationsCount;

	$rootScope.$watch('newPost', function(newValue, oldValue) {
	  $scope.newPosts = newValue;
	});

	$rootScope.$watch('notificationsCount', function(newValue, oldValue){
		$scope.notificationsCount = newValue;
	});

	$scope.logout = function(){
		AuthService.logout();
	};

	$scope.byName = function(){
		$scope.searchBy = 'name';
		$scope.requestSearch();
	};

	$scope.byTag = function(){
		$scope.searchBy = 'tag';
		$scope.requestSearch();
	};

	$scope.search = function(){
		$ionicModal.fromTemplateUrl('views/tabs/modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		    $scope.modal.show();
		});
		$scope.requestSearch();
	};

	$scope.requestSearch = function(){
		$ionicLoading.show();
		$timeout(function(){
			$http.get(SNURL+'search_by/'+$scope.searchBy)
			.success(function(response){
				$ionicLoading.hide();
				$scope.rs = response;
			});
		}, $timeout);	
	};

	$scope.closeModal = function() {
    	$scope.modal.hide();
    	$scope.modal.remove();
  	};

  	$scope.goToCategories = function(name, type){
  		$scope.closeModal();
  		if(type === 'name'){
  			$state.go('tab.comments_user', {name: name});
  		} else {
  			$state.go('tab.tag_category', {name: name});
  		}
  	};

  	$scope.onTabSelected = function(){
  		$rootScope.notificationsCount = 0;
  		$http.post(SNURL+'logs_viewed/'+username);
  	};

  	$scope.onTabDeselected = function(){
  		if($rootScope.notifications.length > 30)
  		{	
  			$rootScope.notifications.splice(30, $rootScope.notifications.length - 30);
  		}
  	};

  	$scope.onHomeTopicsLimit = function(){
  		$rootScope.home_status = true;
  	};

  	$scope.onHomeSelected = function(){
  		$ionicScrollDelegate.scrollTop();
  	}

  	$scope.goProfileSettings = function(){
  		$state.go('tab.changeProfile');
  	}


  	// -----------------------------------Events------------------------------------------
  	socket.on('user.'+username+':App\\Events\\UserCommented', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});
	socket.on('user.'+username+':App\\Events\\UserIsInspired', function(data){
		if(data.inspiredUser != username){
			$scope.notificationsCount = EventService.handleEvents(data);
		} else {
			$rootScope.inspired_count += 1;
		}
	});
	socket.on('user.'+username+':App\\Events\\UserConnectionAdded', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});
	socket.on('user.'+username+':App\\Events\\UserAcceptedConnection', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});
	socket.on('user.'+username+':App\\Events\\ConnectionCreatedPost', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});
	socket.on('all.users:App\\Events\\NewPost', function(data){
		if(data.userCreator != username){
			EventService.handleNewPost();
			$scope.newPosts = $rootScope.newPost;
		} else {
			$rootScope.topics_count += 1;
		}
	});
	socket.on('user.'+username+':App\\Events\\UserUninspired', function(data){
		EventService.handleEvents(data);
	});
	// --------------------------------------------------------------------------------------------
})








.controller('CategoriesCtrl', function(SNURL, $http, $scope, $stateParams, $state){
	$scope.tag_title = $stateParams.name;
	$http.get(SNURL+'get_categories/'+$stateParams.name)
	.success(function(response){
		$scope.topics = response;
	});

	$scope.checkTopic = function(id){
		$state.go('tab.tag_category_topic', {id: id});
	};
});