angular.module('starter')
.controller('TopicCtrl', function($scope, $http, SNURL, $stateParams, InspireService, videoService, $sce, AuthService){
	var authEmail = localStorage.getItem('user.email');
	$scope.topic = {
		pic_thumbnail: ''
	};
	$scope.video_visible = false;

	$http.get(SNURL+'get_topic/'+$stateParams.id+'/'+authEmail)
	.success(function(response){
		$scope.topic = response;
		$scope.video = response.video;

		if($scope.video != '')
		{
			$scope.video_visible = true;
		}
	});

	$scope.beInspiredBy = function(topic_id){
		InspireService.inspiredClass(topic_id);
	};

	$scope.config = {
		theme: "lib/videogular-themes-default/videogular.min.css"
	};

	AuthService.status();

});