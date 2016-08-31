angular.module('starter')
.controller('NewCtrl', function(
	$scope, 
	$http, 
	SNURL, 
	$cordovaFileTransfer, 
	$ionicPopup, $ionicLoading, 
	$timeout, 
	$state, 
	$cordovaCamera, 
	$cordovaCapture, 
	$ionicHistory,
	AuthService,
	$q,
	$filter,
	videoService
){	
	// -------------------------------------Play Video---------------------------------
	$scope.playingVideo = false;
	$scope.playVideo = function(){
		
		var thumbnail = document.getElementById('thumbnail');

		var video = document.getElementById('video');
		$scope.playingVideo = true;
		
		video.requestFullscreen;
		if (video.requestFullscreen) {
		  video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
		  video.mozRequestFullScreen();
		} else if (video.webkitRequestFullscreen) {
		  video.webkitRequestFullscreen();
		}
		video.play();
		$scope.checkVideoStatus(video, thumbnail);
	};

	$scope.checkVideoStatus = function(video, thumbnail){
		video.addEventListener("ended", function(){
			$scope.playingVideo = false;
		}, true);
	};

	//----------------------------------------------------------------------------


	var email = localStorage.getItem('user.email');
	var token = localStorage.getItem('token');
	$scope.tags = [];


	$http.get(SNURL+'create')
	.success(function(response){
		$scope.posts = response.topicTitle;
		$scope.allTags = response.tags;
	});

	$scope.video = '';
	$scope.hasFile = false;
	
	$scope.captureVideo = function() {
	    var options = { limit: 3, duration: 15 };

	    $scope.video = '';

	   	$cordovaCapture.captureVideo(options).then(function(videoData) {
	     	$scope.video = videoData[0].fullPath;
	     	var v = videoService.getExtensionType($scope.video);
	     	$scope.videoType = v.mimeType;
	     	$scope.hasFile = true;
	     	$scope.picture = undefined;
	    }, function(err) {
	      $scope.err = err;
	    });
	}
	
	$scope.loadItems = function(query) {
		var deferred = $q.defer();
		deferred.resolve($filter('filter')($scope.allTags, {text: query}));
		return deferred.promise;
	};

	$scope.takePicture = function(sourceType){
		var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: sourceType,
	      correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      $scope.picture = imageURI;
	      $scope.hasFile = true;
	      $scope.video = '';
	    }, function(err) {
	      $scope.err = err;
	    });
	};

	$scope.cancel = function(){
		$scope.cleanForm();
		$scope.data = undefined;
		$scope.err = undefined;
		$scope.hasFile = false;
		$scope.tags = [];
	};


	$scope.uploadFile = function(options, file){
		$cordovaFileTransfer.upload(SNURL+'store?token='+token, file, options)
		.then(function(response) {
			return response;
		}, function(err) {
			$ionicLoading.hide();
			$ionicPopup.alert({
		     title: 'Error',
		     template: 'Check your internet connection or try again later.'
		   });
			// $scope.err = err;
			console.log(JSON.stringify(err));
		}, function (progress) {
			// constant progress updates
		});
	};


	$scope.uploadVideo = function(title, body, tags_name, topic_title, slug){
		var v = videoService.getExtensionType($scope.video);
		var fileName = 'survivorsNetwork' + new Date().getTime() + v.extension;
		var options = {
			fileKey: "video",
			fileName: fileName,
			httpMethod: "POST",
			chunkedMode: true,
			mimeType: $scope.videoType,
			params: {
		    	title: title,
				body: body,
				slug: slug,
				tags: tags_name,
				topic_title: topic_title,
				email: email
		    }
		};
		$scope.uploadFile(options, $scope.video);
	};


// ---------------------------------------------------------------------------------
    $scope.upload = function(title, body, tags_name, topic_title, slug){
		var fileName = 'surivorsNetwork' + new Date().getTime() + ".jpg";

		var options = {
		    fileKey: "file",
		    fileName: fileName,
		    httpMethod: "POST",
		    chunkedMode: true,
		    mimeType: "image/jpeg",
		    params: {
		    	title: title,
				body: body,
				slug: slug,
				tags: tags_name,
				topic_title: topic_title,
				email: email
		    }
		};

		$scope.uploadFile(options, $scope.picture);
		
    };
	// -------------------------------------------------------------------------

	$scope.postNoFile = function(title, body, tags_name, topic_title, slug){
		$http.post(SNURL+'store', {
			title: title,
			body: body,
			slug: slug,
			tags: tags_name,
			topic_title: topic_title,
			email: email
		}).success(function(response){
			if(response == 'success'){
				$ionicLoading.show();
				$timeout(function(){
					$ionicHistory.clearCache();
					$state.go('tab.home');
					$ionicLoading.hide();
				}, 1000);
			}
			$scope.cleanForm();
		}).error(function(err){
			$scope.err = err;
		});
	};



	$scope.cleanForm = function(){
		document.getElementById('title').value = '';
		document.getElementById('body').value = '';
		document.getElementById('topic_title').value = '';
		$scope.picture = undefined;
		$scope.video = '';
		$scope.tags = [];
		$scope.videoType = '';
	};


	$scope.submit = function(title, body, tags_name, topic_title){
		var slug = title.replace(/ /g,"-");
		$ionicHistory.clearHistory();
		if($scope.picture !=  undefined){
			$ionicLoading.show();
			$timeout(function(){
				$scope.upload(title, body, tags_name, topic_title, slug);
				$ionicHistory.clearCache();
				$state.go('tab.home');
				$scope.cleanForm();
				$ionicLoading.hide();
			}, 1000);

		} else if($scope.video != ''){
			$ionicLoading.show();
			$timeout(function(){
				$scope.uploadVideo(title, body, tags_name, topic_title, slug);
				$ionicHistory.clearCache();
				$state.go('tab.home');
				$scope.cleanForm();
				$ionicLoading.hide();
			}, 1000);
		} else {
			$scope.postNoFile(title, body, tags_name, topic_title, slug);
		}
	};

	AuthService.status();
});


