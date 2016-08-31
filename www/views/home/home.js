angular.module('starter')
.controller('HomeCtrl', function(
	$scope, 
	$http, 
	$state, 
	SNURL, 
	AuthService, 
	videoService, 
	InspireService,  
	$rootScope
){
	$scope.topics = [];
	var authEmail = localStorage.getItem('user.email');
	
	$scope.init = function() {
		AuthService.status();
		$rootScope.newPost = 0;
		$http.get(SNURL+'topics/'+authEmail)
		.success(function(topics) {
			$scope.next_page = topics.next_page_url;
			$scope.topics = topics.data;
		});
	};

	$rootScope.$watch('newPost', function(newValue, oldValue){
		if(newValue != 0){
			document.getElementById('newPostNotification').style.display = 'block';
		}
	});

	$rootScope.$watch('home_status', function(newValue, oldValue){
		if($rootScope.home_status == true)
		{	
			$scope.init();
		}
		$scope.noMoreItemsAvailable = false;
		$rootScope.home_status = false;
	});


	$scope.config = {
		theme: "lib/videogular-themes-default/videogular.min.css"
	};

	$scope.noMoreItemsAvailable = false;

	$scope.loadMore = function() {
	  $http.get($scope.next_page)
	  .success(function (topics) {
	      	$scope.next_page = topics.next_page_url;
			$scope.topics = $scope.topics.concat(topics.data);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if(!$scope.next_page){
				$scope.noMoreItemsAvailable = true;
			}
	  });
	};

	$scope.beInspiredBy = function(topic_id){
		InspireService.inspired(topic_id);
	};

	$scope.refresh = function(){
		document.getElementById('newPostNotification').style.display = 'none';
		$scope.noMoreItemsAvailable = false;
		$scope.init();
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.init();
});